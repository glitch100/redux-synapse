import { synapse } from 'redux-synapse';
import StocksTable from './StocksTable';
import { mapStateToProps, mapDispatchToProps } from './StocksTableContainer';

export default synapse(mapStateToProps, mapDispatchToProps, ['stocks'])(StocksTable);
