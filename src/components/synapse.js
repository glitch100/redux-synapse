import { Component, PropTypes, createElement } from 'react';
import { attach, detach } from '../observer';
import shallowequal from 'shallowequal';

function getComponentName(component) {
  let name = 'Synapse_';
  name += component.displayName || component.name || 'Component';
  return name;
}

export default (mapStateToProps, mapDispatchToProps, pathArray) => {
  return (component) => {
    let msp = mapStateToProps;
    if (!msp) {
      msp = () => { return {}; };
    }
    let props = {};
    function hook(hookProps = this.props) {
      const { getState, dispatch } = this.context.store;
      const stateProps = msp(getState(), hookProps);
      let dispatchProps = {};
      if (mapDispatchToProps) {
        dispatchProps = mapDispatchToProps(dispatch,  hookProps);
      }
      props = {
        ...stateProps,
        ...dispatchProps,
      };

      this.setState({
        version: ++this.state.version,
      });
    }

    class Synapse extends Component {
      constructor() {
        super();
        this.oldProps = {};
        this.state = {
          version: 0,
        };
      }

      componentDidMount() {
        var x = component;
        this.hook = hook.bind(this);
        if (Array.isArray(pathArray) && pathArray.length > 0) {
          this.synapsed = true;
          attach(pathArray, this.hook);
        }else {
          this.synapsed = false;
          this.unsubscribe = this.context.store.subscribe(this.hook);
        }
        this.hook();
      }

      componentWillReceiveProps(nextProps) {
        if (!shallowequal(nextProps, this.props)) {
          this.hook(nextProps);
        }
      }

      shouldComponentUpdate() {
        if (!shallowequal(props, this.oldProps)) {
          this.oldProps = props;
          return true;
        }
        return false;
      }

      componentWillUnmount() {
        if (this.synapsed) {
          detach(pathArray, this.hook);
        }else {
          this.unsubscribe();
        }
      }

      render() {
        const finalComponent = createElement(component, props);
        return finalComponent;
      }
    }
    Synapse.displayName = getComponentName(component);
    Synapse.contextTypes = {
      store: PropTypes.object.isRequired,
    };

    return Synapse;
  };
};
