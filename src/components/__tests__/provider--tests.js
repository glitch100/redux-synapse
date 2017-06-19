const { mount } = require('enzyme');
const React = require('react');

let subscriptions = [];
const unsubscribe = jest.fn();
const subscribe = jest.fn().mockImplementation((s) => {
  subscriptions.push(s);
  return unsubscribe;
});
const createObserverDictionary = jest.fn();
const releaseNotifications = jest.fn();
const setReverseNotficationTraversal = jest.fn();

jest.setMock('../../observer', {
  createObserverDictionary,
  releaseNotifications,
  setReverseNotficationTraversal,
});
const Provider = require.requireActual('../provider');

class DummyComponent extends React.Component {
  render() {
    return (
      <div className="dummyComponent">
        <p>Dummy</p>
      </div>
    );
  }
}

DummyComponent.contextTypes = {
  store: React.PropTypes.object.isRequired,
};
const reverseValue = 1234;
const state = {
  test: 1,
};
const getState = jest.fn().mockImplementation(() => {
  return state;
});
const store = {
  getState,
  subscribe,
};

let wrapper;
describe('Provider', () => {
  beforeEach(() => {
    createObserverDictionary.mockClear();
    releaseNotifications.mockClear();
    setReverseNotficationTraversal.mockClear();
    unsubscribe.mockClear();
    subscribe.mockClear();
    getState.mockClear();
    subscriptions = [];
  });

  describe('Lifecycle', () => {
    beforeEach(() => {
      wrapper = mount(
        <Provider
          store={store}
          reverseTraversal={reverseValue}
        />
      );
    });

    it('calls getState on mount', () => {
      expect(getState).toBeCalled();
    });

    it('calls setReverseNotificationTraversal with prop', () => {
      expect(setReverseNotficationTraversal).toBeCalledWith(reverseValue);
    });

    it('calls createObserverDictionary on mount', () => {
      expect(createObserverDictionary).toBeCalledWith(state);
    });

    it('calls subscribe on mount', () => {
      expect(subscribe).toBeCalled();
    });

    it('adds a new subscriber to the store', () => {
      expect(subscriptions.length).toBe(1);
    });

    it('adds the releaseNotifications to subscribe', () => {
      subscriptions[0]();
      expect(releaseNotifications).toBeCalled();
    });

    it('calls unsubscribe on unmount', () => {
      wrapper.unmount();
      expect(unsubscribe).toBeCalled();
    });
  });

  describe('Children', () => {
    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <DummyComponent />
        </Provider>,
      );
    });

    it('renders its children', () => {
      expect(wrapper.find('.dummyComponent').first()).toBeDefined();
    });
  });
});
