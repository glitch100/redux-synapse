import React, { Component, PropTypes } from 'react';

export default class AddStockTracker extends Component {
  static propTypes = {
    addTracker: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      name: '',
      value: 0,
    };
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value});
  }

  handleValueChange = (event) => {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div>
        <span>Name</span>
        <input value={this.state.name} onChange={this.handleNameChange} type="text" />
        <span>Value</span>
        <input value={this.state.value} onChange={this.handleValueChange} type="number" />
        <button onClick={() => {
          this.props.addTracker(this.state.name, this.state.value);
          this.setState({
            name: '',
            value: 0,
          });
        }}>
          Create new Stock Tracker
        </button>
      </div>
    );
  }
}
