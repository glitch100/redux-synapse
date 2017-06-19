import { synapse } from 'redux-synapse';
import TraderAddress from './TraderAddress';
import { mapStateToProps, mapDispatchToProps } from './TraderAddressContainer';

export default synapse(mapStateToProps, mapDispatchToProps, ['trader-details-name'])(TraderAddress);
