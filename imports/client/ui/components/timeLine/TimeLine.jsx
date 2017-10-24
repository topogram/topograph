import React, { PropTypes } from 'react'
import ui from 'redux-ui'
import moment from 'moment'

import { Card, CardText, CardHeader } from 'material-ui/Card'
import DatePicker from 'material-ui/DatePicker'
import IconButton from 'material-ui/IconButton'
import PlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';
import Pause from 'material-ui/svg-icons/av/pause';
import TimeSlider from './TimeSlider.jsx'

const styleTimeLine = {
  height: '20vh',
  position: 'fixed',
  bottom: 0,
  width: '100vw'
}

@ui()





export default class TimeLine extends React.Component {

  static propTypes = {
    hasTimeInfo : PropTypes.bool
  }

  handleChangeMinTime = (event, date) => {
    this.props.updateUI('minTime', date)
  }

  handleChangeMaxTime = (event, date) => {
    this.props.updateUI('maxTime', date)
  }

  openMinDatePicker = () => {
    this.refs.minDatePicker.focus()
  }

  openMaxDatePicker = () => {
    this.refs.maxDatePicker.focus()

  }

  pauseOrClear = (event ) => {


     window.clearInterval(this.timerForPlay);
    if (this.playOrResumeTrig == 1){
      //if paused before :clean
      if (this.pauseOrClearTrig ==1) {
        k = Math.round(this.props.ui.minTime)
        this.props.updateUI({currentSliderTime :  k })
        this.pauseOrClearTrig= 0
        this.playOrResumeTrig =0
        }
      else {

        this.pauseOrClearTrig= 1
        }
      }
    else {
      this.pauseOrClearTrig= 1
      this.playOrResumeTrig =0
    }
   }

  playOrResume = (event ) => {
    k = Math.round(this.props.ui.minTime)

    if (!this.pauseOrClearTrig){
      this.playOrResumeTrig = 0
      this.pauseOrClearTrig =0
      }



    if (this.pauseOrClearTrig== 1) {
      this.pauseOrClearTrig = 0;
      k = this.props.ui.currentSliderTime
      }

    else {
      if (this.timerForPlay){
        window.clearInterval(this.timerForPlay);
        }
      }

    this.playOrResumeTrig = 1
    var seconds = parseInt((this.props.ui.maxTime-this.props.ui.minTime)/1000);
    var tempo = Math.floor(seconds);

    this.timerForPlay = window.setInterval(function(){

       this.props.updateUI({currentSliderTime :  k })
       this.playOrResumeTrig = 1

       k = Math.round(k + tempo)
       if (k >= Math.round(this.props.ui.maxTime)){
         window.clearInterval(this.timerForPlay).bind(this)
        }
      }.bind(this),10)

    }

  render() {

    const { minTime, maxTime } = this.props.ui
    const { hasTimeInfo } = this.props

    return (
      <Card
        style={styleTimeLine}
      >
        { !hasTimeInfo ?
          <CardHeader
            title={'No time info available.'}
          />
          :
          <div>
            <CardHeader
              subtitle={
                <p>
                  From <a onClick={this.openMinDatePicker}
                    style={{ cursor : 'pointer', color : 'black' }}>
                    {`${moment(minTime).format('MMM Do YYYY')}`}
                  </a>
                   to <a onClick={this.openMaxDatePicker}
                    style={{ cursor : 'pointer', color : 'black' }}>
                    {`${moment(maxTime).format('MMM Do YYYY')}`}
                  </a>

                  <IconButton onClick={this.playOrResume} alt="Play/Resume" title="Play/Resume">
                    <PlayCircleFilled />

                  </IconButton>
                  <IconButton onClick={this.pauseOrClear}  alt="Pause/Stop" title="Pause/Stop">
                    <Pause />
                  </IconButton>
                </p>
              }
            />



            <DatePicker
              onChange={this.handleChangeMinTime}
              ref="minDatePicker"
              autoOk={true}
              textFieldStyle={{ display: 'none' }}
              floatingLabelText="Min Date"
              value={minTime}
            />
            <DatePicker
              ref="maxDatePicker"
              textFieldStyle={{ display: 'none' }}
              onChange={this.handleChangeMaxTime}
              autoOk={true}
              floatingLabelText="Max Date"
              value={maxTime}
            />
            <CardText>
              { minTime && maxTime ?
                <div>


                      <TimeSlider
                        minTime={new Date(minTime).getTime()}
                        maxTime={new Date(maxTime).getTime()}
                    />

                </div>
                :
                null
              }
            </CardText>
          </div>
        }
      </Card>
    )
  }
}
