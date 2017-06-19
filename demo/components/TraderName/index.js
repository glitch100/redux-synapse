import { synapse } from 'redux-synapse';
import TraderName from './TraderName';
import { mapStateToProps, mapDispatchToProps } from './TraderNameContainer';

export default synapse(mapStateToProps, mapDispatchToProps, ['trader-details-name'])(TraderName);
