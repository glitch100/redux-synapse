const DEFAULT_DELIMITER = '-';
let _observerDictionary = {};
let _attachQueue = [];
let _prepareQueue = [];
let hitSubs = [];

const hitSubscriber = (s) => {
  if (hitSubs.indexOf(s) === -1) {
    hitSubs.push(s);
    s();
  }
};

function notify(keys) {
  hitSubs = [];
  for (let i = 0; i < keys.length; i++) {
    const split = keys[i].split(DEFAULT_DELIMITER);
    let tempKey = null;
    for (let j = 0; j < split.length; j++) {
      if (!tempKey) {
        tempKey = split[j];
      }else {
        tempKey += `-${split[j]}`;
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
          tempKey += `-${split[j]}`;
        }
        _observerDictionary[tempKey].subscribers.push(observer);
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
          tempKey += `-${split[j]}`;
        }
        _observerDictionary[tempKey].subscribers.splice(observer, 1);
      }
    }
  }
}

function recurseObserverDictionary(state, prefix = null) {
  for (const propName in state) {
    if (state.hasOwnProperty(propName)) {
      const value = state[propName];
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
      if (typeof value === 'object' && !value.toJS) {
        if (prefix) {
          prefix.push(propName);
        }
        const passedDownPrefix = prefix || [propName];
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


export default {
  attach,
  createObserverDictionary,
  detach,
  prepareNotification,
  releaseNotifications,
  get observerDictionary() {
    return _observerDictionary;
  },
  get attachQueue() {
    return _attachQueue;
  },
  get prepareQueue() {
    return _prepareQueue;
  },
};
