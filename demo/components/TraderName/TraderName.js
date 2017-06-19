import React, { PropTypes } from 'react';

export default class TraderName extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
    setAccountValue: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
    };
  }

  handleChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  }

  handleClick = () => {
    this.props.setName(this.state.name);
  }

  render() {
    return (
      <div>
        <h3>Trader Name: {this.props.name}</h3>
        <input type="text" onChange={this.handleChange} value={this.state.name} />
        <button onClick={this.handleClick}>Set Name</button>
      </div>
    );
  }
}
