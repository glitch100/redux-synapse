import { Component, PropTypes, createElement } from 'react';
import { attach, detach } from '../observer';
import shallowequal from 'shallowequal';
import hoistStatics from 'hoist-non-react-statics';

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
    let synapseProps = {};
    function hook(hookProps = this.props) {
      const { getState, dispatch } = this.context.store;
      const stateProps = msp(getState(), hookProps);
      let dispatchProps = {};
      if (mapDispatchToProps) {
        dispatchProps = mapDispatchToProps(dispatch,  hookProps);
      }
      synapseProps = {
        ...stateProps,
        ...dispatchProps,
      };

      this.setState({
        version: ++this.state.version,
      });
    }

    class Synapse extends Component {
      constructor(props, context) {
        super(props, context);
        this.oldProps = {
          ...msp(context.store.getState(), props),
          ...mapDispatchToProps ? mapDispatchToProps(context.store.dispatch) : {},
        };
        synapseProps = this.oldProps;
        this.state = {
          version: 0,
        };
      }

      componentDidMount() {
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
        if (!shallowequal(synapseProps, this.oldProps)) {
          this.oldProps = synapseProps;
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
        const finalComponent = createElement(component, synapseProps);
        return finalComponent;
      }
    }
    Synapse.displayName = getComponentName(component);
    Synapse.contextTypes = {
      store: PropTypes.object.isRequired,
    };

    return hoistStatics(Synapse, component);
  };
};
