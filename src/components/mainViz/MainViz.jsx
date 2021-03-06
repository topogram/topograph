import React from 'react'
import PropTypes from 'prop-types'

import Network from '../network/Network.jsx'
import GeoMap from '../geoMap/GeoMap.jsx'
import TimeLine from '../timeLine/TimeLine.jsx'


export default class MainViz extends React.Component {

  render() {

    const {
      topogramId,
      nodes,
      edges,
      hasGeoInfo,
      hasTimeInfo,
      onFocusElement,
      onUnfocusElement,
      onClickElement,
      selectElement,
      unselectElement,
      unselectAllElements
     } = this.props


    const {
      timeLineVisible,
      geoMapVisible,
      graphVisible,
      currentSliderTime,
      minTime,
      maxTime
    } = this.props.ui

    const panelsCount = [geoMapVisible, graphVisible]
      .filter(d => d).length

    const height = timeLineVisible ? '70vh' : '100vh'

    let width = '100vw'
    if (panelsCount === 2) width = '50vw'
    // if (panelsCount === 3) width = '33vw'

    return (
      <div>
        {
          geoMapVisible && hasGeoInfo ?
            <GeoMap
              nodes={ nodes }
              edges={ edges }
              width={ width }
              height={ height }
              onFocusElement={onFocusElement}
              onUnfocusElement={onUnfocusElement}
              selectElement={selectElement}
              unselectElement={unselectElement}
              unselectAllElements={unselectAllElements}
              ui={this.props.ui}
            />
            :
            null
        }
        {
          graphVisible ?
            <Network
              topogramId={ topogramId }
              nodes={ nodes }
              edges={ edges }
              width={ width }
              height={ height }
              onFocusElement={onFocusElement}
              onUnfocusElement={onUnfocusElement}
              selectElement={selectElement}
              unselectElement={unselectElement}
              unselectAllElements={unselectAllElements}
              ui={this.props.ui}
            />
            :
            null
        }
        {
          this.props.ui.timeLineVisible ?
            <TimeLine
              hasTimeInfo={hasTimeInfo}
              maxTime={maxTime}
              minTime={minTime}
            />
            :
            null
        }
      </div>
    )
  }
}

MainViz.propTypes = {
  // topogramId: PropTypes.string.isRequired,
  nodes: PropTypes.array,
  edges: PropTypes.array,
  hasGeoInfo : PropTypes.bool,
  hasTimeInfo :  PropTypes.bool,
  onFocusElement : PropTypes.func.isRequired,
  onUnfocusElement : PropTypes.func.isRequired,
  selectElement : PropTypes.func.isRequired,
  unselectElement : PropTypes.func.isRequired,
  unselectAllElements : PropTypes.func.isRequired
}
