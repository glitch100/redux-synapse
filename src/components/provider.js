import React, { Component, PropTypes } from 'react';
import {
  createObserverDictionary,
  releaseNotifications,
  setDelimiter,
  setReverseNotficationTraversal
} from '../observer';

export default class Provider extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    delimiter: PropTypes.string,
    reverseTraversal: PropTypes.bool,
  };

  static defaultPropTypes = {
    reverseTraversal: true,
  };

  static childContextTypes = {
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.store = props.store;
  }

  getChildContext() {
    return {
      store: this.store,
    };
  }

  componentDidMount() {
    if (this.props.delimiter) {
      setDelimiter(this.props.delimiter);
    }
    setReverseNotficationTraversal(this.props.reverseTraversal);
    createObserverDictionary(this.store.getState());
    this.unsubscribe = this.store.subscribe(() => {
      releaseNotifications();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
