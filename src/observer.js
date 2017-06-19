let DEFAULT_DELIMITER = '-';
let _reverseNotificationMode = true;
let _observerDictionary = {};
let _attachQueue = [];
let _prepareQueue = [];
let hitSubs = [];
const indexableKey = new RegExp(/{(.*?)}/);
window.__SYNAPSE__ = {};
const hitSubscriber = (s) => {
  if (hitSubs.indexOf(s) === -1) {
    hitSubs.push(s);
    s();
  }
};

function notify(keys) {
  hitSubs = [];
  for (let i = 0; i < keys.length; i++) {
    // TODO: Experimental functionality
    if (!_reverseNotificationMode) {
      const entry = _observerDictionary[keys[i]];
      if (entry) {
        _observerDictionary[keys[i]].subscribers.forEach(hitSubscriber);
      }else {
        // TODO: Surround in process check
        console.warn('Attempted to update on a non-existent key: ', keys[i],
        '\nDictionary Entries: ', Object.keys(_observerDictionary));
      }
      continue;
    }
    const split = keys[i].split(DEFAULT_DELIMITER);
    let tempKey = null;
    for (let j = 0; j < split.length; j++) {
      if (!tempKey) {
        tempKey = split[j];
      }else {
        tempKey += `${DEFAULT_DELIMITER}${split[j]}`;
      }
      const entry = _observerDictionary[tempKey];
      if (entry) {
        _observerDictionary[tempKey].subscribers.forEach(hitSubscriber);
      }else {
        // TODO: Surround in process check
        console.warn('Attempted to update on a non-existent key: ', tempKey,
        '\nDictionary Entries: ', Object.keys(_observerDictionary));
      }
    }
  }
}

function attach(keys, observer) {
  if (Object.keys(_observerDictionary).length === 0) {
    _attachQueue.push({
      keys,
      observer,
    });
  }else {
    for (let i = 0; i < keys.length; i++) {
      const split = keys[i].split(DEFAULT_DELIMITER);
      let tempKey = null;
      for (let j = 0; j < split.length; j++) {
        if (!tempKey) {
          tempKey = split[j];
        }else {
          // TODO: Dynamic associative keys
          if (indexableKey.test(split[j])) {
            throw new Error('Dynamic entries in keypaths are currently not supported. Please do not use the `{i}` format.');
            // const index = split[j].substring(1,split[j].length - 1);
          }else {
            tempKey += `${DEFAULT_DELIMITER}${split[j]}`;
          }
        }
        if(_observerDictionary[tempKey]) {
          _observerDictionary[tempKey].subscribers.push(observer);
        }else {
          if (process.NODE_ENV !== 'production') {
            console.warn('Invalid Paths provided to Synapse during attach process', keys);
          }
        }
      }
    }
  }
}

function detach(keys, observer) {
  if (Object.keys(_observerDictionary).length === 0) {
    _attachQueue.splice(observer, 1);
  }else {
    for (let i = 0; i < keys.length; i++) {
      const split = keys[i].split(DEFAULT_DELIMITER);
      let tempKey = null;
      for (let j = 0; j < split.length; j++) {
        if (!tempKey) {
          tempKey = split[j];
        }else {
          tempKey += `${DEFAULT_DELIMITER}${split[j]}`;
        }
        if(_observerDictionary[tempKey]) {
          _observerDictionary[tempKey].subscribers.splice(observer, 1);
        }else {
          if (process.NODE_ENV !== 'production') {
            console.warn('Invalid Paths provided to Synapse during detatch process', keys);
          }
        }
      }
    }
  }
}

function recurseObserverDictionary(state, prefix = null) {
  for (const propName in state) {
    if (state.hasOwnProperty(propName)) {
      let value = state[propName];
      let key = propName;
      if (Array.isArray(prefix)) {
        let prefixConcat = '';
        for (let i = 0; i < prefix.length; i++) {
          prefixConcat += prefix[i] + DEFAULT_DELIMITER;
        }
        key = prefixConcat + key;
      }
      _observerDictionary[key] = {
        subscribers: [],
      };
      // TODO: Add in support for Immutable data structures
      if (value && typeof value === 'object' && Object.keys(value).length && !Array.isArray(value)) {
        let innerPrefix;
        if (prefix) {
          innerPrefix = [...prefix, propName];
        }
        const passedDownPrefix = innerPrefix || [propName];
        if (value.toJS) {
          value = value.toJS();
        }
        recurseObserverDictionary(value, passedDownPrefix);
      }
    }
  }
}

function createObserverDictionary(state) {
  _observerDictionary = {};
  recurseObserverDictionary(state);
  for (let j = 0; j < _attachQueue.length; j++) {
    const item = _attachQueue[j];
    attach(item.keys, item.observer);
    item.observer();
  }
  _attachQueue = [];
  window.__SYNAPSE__.dictionary = _observerDictionary;
}

function prepareNotification(keys) {
  for (let i = 0; i < keys.length; i++) {
    if (_prepareQueue.indexOf(keys[i]) === -1) {
      _prepareQueue.push(keys[i]);
    }
  }
}

function releaseNotifications() {
  if (_prepareQueue.length > 0) {
    notify(_prepareQueue);
    _prepareQueue = [];
  }
}

/**
 * Experimental feature. This is used when you want to set how notifications work.
 * By default if provided with the path [keyfloor-keybasement-keyunderground] it will
 * reoslve and noficy subscribers at each level. However when set to false, it will only
 * resolve the final key in the path and only notify it's subscribers.
 *
 * @param {boolean} The value to set the reverseNotificationMode too. Defaults to true
 */
function setReverseNotficationTraversal(value = true) {
  _reverseNotificationMode = value;
}


/**
 * This allows the delimiter to be changed that is used within the dictionary on all
 * key paths.
 *
 * @param {String} newDelimiter - The delimiter to use in dictonary creation
 */
function setDelimiter(newDelimiter) {
  if (newDelimiter) {
    DEFAULT_DELIMITER = newDelimiter;
  }
}

/**
 * Function to get and return the configured delimiter.
 *
 * @returns {String} - The default delimiter
 */
function getDelimiter() {
  return DEFAULT_DELIMITER;
}

/**
 * Used exclusively for testing
 *
 */
function resetObserver() {
  _observerDictionary = {};
  _prepareQueue = [];
  _attachQueue = [];
}

export default {
  attach,
  createObserverDictionary,
  detach,
  prepareNotification,
  releaseNotifications,
  setDelimiter,
  getDelimiter,
  get observerDictionary() {
    return _observerDictionary;
  },
  get attachQueue() {
    return _attachQueue;
  },
  get prepareQueue() {
    return _prepareQueue;
  },
  resetObserver,
  setReverseNotficationTraversal,
};
