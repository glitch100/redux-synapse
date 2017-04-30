import { synapse } from 'redux-synapse';
import TraderCTA from './TraderCTA';
import { mapStateToProps, mapDispatchToProps } from './TraderCTAContainer';

export default synapse(mapStateToProps, mapDispatchToProps, ['trader-details-name'])(TraderCTA);
