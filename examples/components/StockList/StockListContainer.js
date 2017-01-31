import StockList from './StockList';
import { synapse } from 'redux-synapse';
// import { connect } from 'react-redux';
import { CHANGE_STOCK_VALUE } from '../../actions/constants';

const mapStateToProps = (state, ownProps) => {
  return {
    stock: state.stock,
  }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const mapDispatchToProps = (dispatch, ownProps, getState) => {
  return {
    changeStock: (stock) =>{
      const keys = Object.keys(stock);
      for (let i = 0; i < keys.length; i++) {
        const item = stock[keys[i]];
        dispatch({
          type: CHANGE_STOCK_VALUE,
          name: keys[i],
          add: Math.random() > 0.5,
          value: getRandomArbitrary(item.value - 1000, item.value + 1000),
        });
      }
    }
  }
}

export default synapse(mapStateToProps, mapDispatchToProps, ['stock'])(StockList);
// export default connect(mapStateToProps, mapDispatchToProps)(StockList);
