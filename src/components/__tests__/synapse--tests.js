const { mount, shallow } = require('enzyme');
const React = require('react');
const Provider = require.requireActual('../provider');
const synapse = require.requireActual('../synapse');

const getState = jest.fn().mockReturnValue({
  time: 100,
});
const dispatch = jest.fn();
const unsubscribe = jest.fn();
const subscribe = jest.fn().mockReturnValue(unsubscribe);

const attach = jest.fn();
const detach = jest.fn();
jest.setMock('../../observer', {
  attach,
  detach,
});

const dummyComponent = (props) => {
  return (
    <div>
      <p className="timeClass">{props.time}</p>
    </div>
  );
};

dummyComponent.propTypes = {
  time: React.PropTypes.number,
};
dummyComponent.defaultPropTypes = {
  time: 1,
};

const mapStateToProps = (state) => {
  return {
    time: state.time,
  };
};

const store = {
  getState,
  dispatch,
  subscribe,
};

describe('synapse', () => {
  beforeEach(() => {
    attach.mockClear();
    detach.mockClear();
    getState.mockClear();
    dispatch.mockClear();
    subscribe.mockClear();
    unsubscribe.mockClear();
  });

  it('returns a synapse\'d component with correct display name', () => {
    const syn = synapse(mapStateToProps)(dummyComponent);
    expect(syn.displayName).toBe('Synapse_dummyComponent');
  });

  it('returns a synapse\'d component', () => {
    const syn = synapse(mapStateToProps)(dummyComponent);
    const wrapper = shallow(<syn />, { store });

    const pTag = wrapper.find('timeClass').first();

    expect(pTag).toBeDefined();
  });

  describe('Lifecycle', () => {
    let wrapper;
    describe('valid pathArray', () => {
      beforeEach(() => {
        const syn = synapse(mapStateToProps, null, ['time'])(dummyComponent);
        wrapper = renderComponent(
          <Provider store={store}>
            <syn />
          </Provider>);
      });

      // TODO: Tests failing - Need to use TestUtils?.
      // it('calls attach if pathArray provided', () => {
      //   expect(attach).toBeCalled();
      // });

      // it('calls detach if pathArray provided and unmount', () => {
      //   wrapper.unmount();
      //   expect(detach).toBeCalled();
      // });
    });

    describe('invalid pathArray', () => {
      beforeEach(() => {
        const syn = synapse(mapStateToProps, null)(dummyComponent);
        wrapper = mount(
          <Provider store={store}>
            <syn />
          </Provider>);
      });

      it('calls subscribe if no pathArray provided', () => {
        expect(subscribe).toBeCalled();
      });

      it('calls unsubscribe if no pathArray provided and unmount', () => {
        wrapper.unmount();
        expect(unsubscribe).toBeCalled();
      });
    });

    describe('willReceiveProps', () => {
      it('calls shallowEqual on propChange', () => {
        // TODO
      });

      it('calls provided mapStateToProps via hook func on propChange if different', () => {
        // TODO
      });
    });
  });
});
