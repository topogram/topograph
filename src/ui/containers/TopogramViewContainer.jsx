import { connect } from 'react-redux'
import { stopSubscription } from 'meteor-redux-middlewares'

import { loadNodes, NODES_SUB } from '/imports/client/actions/nodes'
import { loadEdges, EDGES_SUB } from '/imports/client/actions/edges'
import { loadTopogram, TOPOGRAM_SINGLE_SUB } from '/imports/client/actions/topogram'

import { TopogramViewComponent } from '/imports/client/ui/pages/TopogramViewComponent'

const mapStateToProps = state => ({
  nodesReady: state.nodes.ready,
  nodes: state.nodes.nodes,
  hasTimeInfo : state.nodes.hasTimeInfo,
  hasGeoInfo : state.nodes.hasGeoInfo,
  minTime : state.nodes.minTime,
  maxTime : state.nodes.maxTime,
  nodeCategories : state.nodes.nodeCategories,
  edgesReady: state.edges.ready,
  edges: state.edges.edges,
  topogram : state.topogram.topogram,
  topogramReady : state.topogram.ready,
  userId : state.user._id,
  isLoggedIn : state.user.isLoggedIn
})

const mapDispatchToProps = dispatch => ({
  loadTopogram: (topogramId) => dispatch(loadTopogram(topogramId)),
  loadNodes: (topogramId) => dispatch(loadNodes(topogramId)),
  loadEdges: (topogramId) => dispatch(loadEdges(topogramId)),
  stopNodesSubscription: () => dispatch(stopSubscription(NODES_SUB)),
  stopEdgesSubscription: () => dispatch(stopSubscription(EDGES_SUB)),
  stopTopogramSubscription: () => dispatch(stopSubscription(TOPOGRAM_SINGLE_SUB)),
})

export const TopogramViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopogramViewComponent)
