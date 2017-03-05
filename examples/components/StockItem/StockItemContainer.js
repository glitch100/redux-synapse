import StockItem from './StockItem';
import { synapse } from 'redux-synapse';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  const name = ownProps.name;
  return {
    name: state.stock[name].name,
    value: state.stock[name].value,
    history: state.stock[name].history,
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return { }
};

export default synapse(mapStateToProps, mapDispatchToProps, ['stock'])(StockItem);
// export default connect(mapStateToProps, null, null, { pure: false })(StockItem);
