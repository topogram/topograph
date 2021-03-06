import React from 'react'
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux'

import store from "./store";

import "./css/topogram.scss";
import App from './App.jsx'
import { TopogramViewComponent } from "./TopogramViewComponent.jsx"

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
  ui: state.ui,
  config: state.config
})

const TopogramViewContainer = connect(
  mapStateToProps
)(TopogramViewComponent)

export default class Topograph extends React.Component {

  static propTypes = {
    nodes : PropTypes.array.isRequired,
    edges : PropTypes.array.isRequired,
    config : PropTypes.object
  }

  componentWillUpdate(nextProps) {

    const {
      config,
      nodes,
      edges
    } = nextProps

    if (nodes.length) {
      store.dispatch({
        type: 'NODES_LOADED',
        payload : nodes
      })
    }

    if (edges.length) {
      store.dispatch({
        type: 'EDGES_LOADED',
        payload : edges
      })
    }

    if (config) {
      store.dispatch({
        type: 'CONFIG_LOADED',
        payload : config
      })
    }

  }

  render() {
    return (
      <Provider store={store}>
        <App>
          <TopogramViewContainer />
        </App>
      </Provider>
      )
    }
}
