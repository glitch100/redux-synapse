import React, { PropTypes } from 'react';

export default class TraderAddress extends React.Component {
  static propTypes = {
    street: PropTypes.string.isRequired,
    setStreet: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      street: props.street,
    };
  }

  handleChange = (e) => {
    this.setState({
      street: e.target.value,
    });
  }

  handleClick = () => {
    this.props.setStreet(this.state.street);
  }

  render() {
    return (
      <div>
        <h3>Address:</h3>
        <h5>Street</h5>
        <input type="text" onChange={this.handleChange} value={this.state.street} />
        <button onClick={this.handleClick}>Set Address</button>
      </div>
    );
  }
}
