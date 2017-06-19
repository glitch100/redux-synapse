let observer;
console.warn = jest.fn();
const state = {
  dummy: {
    testArray: [],
    testBool: false,
    testDeeper: {
      testLevel: 1,
    },
  },
};
const recursedDictionary = {
};
recursedDictionary.dummy = {
  subscribers: [],
};
recursedDictionary['dummy-testArray'] = {
  subscribers: [],
};
recursedDictionary['dummy-testBool'] = {
  subscribers: [],
};
recursedDictionary['dummy-testDeeper'] = {
  subscribers: [],
};
recursedDictionary['dummy-testDeeper-testLevel'] = {
  subscribers: [],
};

describe('Observer Tests', () => {
  beforeEach(() => {
    observer = require.requireActual('../observer');
    observer.resetObserver();
  });

  it('initializes with an empty attach queue', () => {
    expect(observer.attachQueue.length).toBe(0);
  });

  it('initializes with an empty prepare queue', () => {
    expect(observer.prepareQueue.length).toBe(0);
  });

  it('initializes with an empty dictionary', () => {
    expect(Object.keys(observer.observerDictionary).length).toBe(0);
  });

  describe('createObserverDictionary', () => {
    it('can construct the dictionary', () => {
      observer.createObserverDictionary(state);
      expect(observer.observerDictionary).toEqual(recursedDictionary);
    });

    it('adds in empty subscriber lists for keys', () => {
      observer.createObserverDictionary(state);
      expect(observer.observerDictionary.dummy.subscribers).toBeDefined();
      expect(observer.observerDictionary.dummy.subscribers.length).toBe(0);
    });

    it('adds in queued observers post dictionary creation', () => {
      const cb = jest.fn();
      observer.attach(['dummy'], cb);
      observer.createObserverDictionary(state);

      expect(observer.observerDictionary.dummy.subscribers[0]).toBe(cb);
    });

    it('immediately calls queued observers post dictionary creation', () => {
      const cb = jest.fn();
      const cb1 = jest.fn();
      observer.attach(['dummy'], cb);
      observer.attach(['dummy'], cb1);
      observer.createObserverDictionary(state);
      expect(cb).toBeCalled();
      expect(cb1).toBeCalled();
    });
  });

  describe('attach', () => {
    beforeEach(() => {
      observer.resetObserver();
    });

    it('adds an entry to the attachQueue if dictionary not built', () => {
      const cb = jest.fn();
      observer.attach(['dummy'], cb);

      expect(observer.attachQueue.length).toBe(1);
      expect(observer.attachQueue[0].observer).toBe(cb);
    });

    it('pushes to the relevant subscriber queue if dictionary built', () => {
      observer.createObserverDictionary(state);
      const cb = jest.fn();
      observer.attach(['dummy'], cb);

      expect(observer.observerDictionary.dummy.subscribers.length).toBe(1);
      expect(observer.observerDictionary.dummy.subscribers[0]).toBe(cb);
    });

    it('pushes to the all relevant subscriber queues if dictionary built', () => {
      observer.createObserverDictionary(state);
      const cb = jest.fn();
      observer.attach(['dummy-testDeeper-testLevel'], cb);

      expect(observer.observerDictionary.dummy.subscribers[0]).toBe(cb);
      expect(observer.observerDictionary['dummy-testDeeper'].subscribers[0]).toBe(cb);
      expect(observer.observerDictionary['dummy-testDeeper-testLevel'].subscribers[0]).toBe(cb);
    });
  });

  describe('detach', () => {
    const key = 'dummy';
    const cb = jest.fn();

    it('removes the observer from queue if no dictionary built', () => {
      observer.attach([key], cb);
      expect(observer.attachQueue.length).toBe(1);
      observer.detach(key, cb);
      expect(observer.attachQueue.length).toBe(0);
    });

    it('removes from the relevant subscriber queue if dictionary built', () => {
      observer.createObserverDictionary(state);
      observer.attach([key], cb);
      observer.detach([key], cb);
      expect(observer.observerDictionary.dummy.subscribers.length).toBe(0);
    });

    it('removes all relevant subscribers from queue if dictionary built', () => {
      const deepKey = 'dummy-testDeeper-testLevel';
      observer.createObserverDictionary(state);
      observer.attach([deepKey], cb);
      observer.detach([deepKey], cb);

      expect(observer.observerDictionary.dummy.subscribers.length).toBe(0);
      expect(observer.observerDictionary['dummy-testDeeper'].subscribers.length).toBe(0);
      expect(observer.observerDictionary['dummy-testDeeper-testLevel'].subscribers.length).toBe(0);
    });
  });

  describe('prepareNotification', () => {
    it('pushes provided keys to the prepareQueue', () => {
      const key = 'test';
      const keys = [key];

      observer.prepareNotification(keys);

      expect(observer.prepareQueue.length).toBe(1);
      expect(observer.prepareQueue[0]).toBe(key);
    });

    it('doesn\'t push duplicate keys to the prepareQueue', () => {
      const key = 'test';
      const keys = [key, key];

      observer.prepareNotification(keys);

      expect(observer.prepareQueue.length).toBe(1);
    });
  });

  describe('releaseNotifications & notify', () => {
    it('clears prepareQueue after releasing', () => {
      observer.prepareNotification(['test1', 'test2', 'test3']);
      observer.releaseNotifications();
      expect(observer.prepareQueue.length).toBe(0);
    });

    it('warns subscribers if non existent', () => {
      observer.createObserverDictionary(state);
      observer.prepareNotification(['test1']);
      observer.releaseNotifications();

      expect(console.warn).toBeCalled();
    });

    it('calls prepared notifications', () => {
      const cb = jest.fn();
      const cb1 = jest.fn();
      const key = 'dummy';
      observer.createObserverDictionary(state);
      observer.attach([key], cb);
      observer.attach([key], cb1);
      observer.prepareNotification(['dummy']);
      observer.releaseNotifications();

      expect(cb).toBeCalled();
      expect(cb1).toBeCalled();
    });

    it('doesnt call already called notifications', () => {
      const cb = jest.fn();
      const cb1 = jest.fn();
      const key = 'dummy';
      const deeperKey = 'dummy-testArray';
      observer.createObserverDictionary(state);
      observer.attach([key], cb);
      observer.attach([key], cb1);
      observer.attach([deeperKey], cb);
      observer.prepareNotification(['dummy']);
      observer.releaseNotifications();

      expect(cb.mock.calls.length).not.toBe(2);
    });
  });
});
