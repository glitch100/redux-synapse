import React, { Component, PropTypes } from 'react';
import { createObserverDictionary, releaseNotifications } from '../observer';

export default class Provider extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
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
