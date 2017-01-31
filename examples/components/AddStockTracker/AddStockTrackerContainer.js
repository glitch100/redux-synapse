import AddStockTracker from './AddStockTracker';
import { synapse } from 'redux-synapse';
import { ADD_TRACKER } from '../../actions/constants';
// import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addTracker: (name, value) =>{
      dispatch({
        type: ADD_TRACKER,
        name,
        value,
      });
    }
  }
}

export default synapse(null, mapDispatchToProps)(AddStockTracker);
// export default connect(null, mapDispatchToProps)(AddStockTracker);
