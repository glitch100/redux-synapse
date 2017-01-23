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
    if (!mapStateToProps) {
      throw Error('mapStateToProps must be specified', component);
    }
    let props = {};
    function hook(hookProps = this.props) {
      const { getState, dispatch } = this.context.store;
      const stateProps = mapStateToProps(getState(), hookProps);
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
        this.hook = hook.bind(this);
        if (Array.isArray(pathArray) && pathArray.length > 0) {
          this.synapsed = true;
          attach(pathArray, this.hook);
        }else {
          this.unsubscribe = this.context.store.subscribe(this.hook);
        }
      }

      componentWillReceiveProps(nextProps) {
        // TODO: Shallow Equal
        this.hook(nextProps);
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
