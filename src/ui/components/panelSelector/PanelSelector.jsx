import React, { PropTypes } from 'react'
import ui from 'redux-ui'

import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Checkbox from 'material-ui/Checkbox'


const buttonStyle = {
  margin: 2,
  padding: '10px 20px'
}

@ui()
export default class PanelSelector extends React.Component {

  static propTypes = {
    bottom : PropTypes.string,
    hasGeoInfo : PropTypes.bool.isRequired,
    hasTimeInfo : PropTypes.bool.isRequired
  }

  toggleGeo() {
    this.props.updateUI( 'geoMapVisible', !this.props.ui.geoMapVisible )
  }

  toggleGraph() {
    this.props.updateUI( 'graphVisible', !this.props.ui.graphVisible )
  }

  toggleTimeline() {
    this.props.updateUI( 'timeLineVisible', !this.props.ui.timeLineVisible )
  }

  toggleSelectionPanel() {
    this.props.updateUI( 'selectionPanelPinned', !this.props.ui.selectionPanelPinned )
  }

  render() {
    const {
      timeLineVisible,
      geoMapVisible,
      graphVisible
    } = this.props.ui

    const {
      bottom,
      hasGeoInfo,
      hasTimeInfo
    } = this.props

    return (
      <Menu
        desktop={true}
        style={{maxWidth:'100%'}}
        >
        <MenuItem style={buttonStyle}>
          <Checkbox
            label={ 'Graph'}
            checked={graphVisible}
            onClick={ () => this.toggleGraph()}
          />
        </MenuItem>
        <MenuItem style={buttonStyle}>
          <Checkbox
            label={'Geo'}
            checked={geoMapVisible}
            disabled={!hasGeoInfo}
            onClick={ () => this.toggleGeo()}
          />
        </MenuItem>
        <MenuItem style={buttonStyle}>
          <Checkbox
            label={'Time'}
            checked={timeLineVisible}
            disabled={!hasTimeInfo}
            onClick={ () => this.toggleTimeline()}
          />
        </MenuItem>
        {/* <MenuItem style={buttonStyle}>
          <Checkbox
            label={"Selection"}
            checked={selectionPanelPinned}
            onClick={ () => this.toggleSelectionPanel()}
          />
        </MenuItem> */}
      </Menu>
    )
  }
}
