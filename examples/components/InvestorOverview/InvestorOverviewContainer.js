import InvestorOverview from './InvestorOverview';
import { synapse } from 'redux-synapse';
// import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {
    investors: state.investors,
  }
}

export default synapse(mapStateToProps, null, ['investors'])(InvestorOverview);
// export default connect(mapStateToProps, null, null, { pure: false })(InvestorOverview);
