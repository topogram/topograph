import React from 'react'
import PropTypes from 'prop-types'

import './css/topogram.scss'

import { IntlProvider } from 'react-intl'
import { messages } from './helpers/i18n.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { green500, indigo700, redA200 } from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

// import injectTapEventPlugin from 'react-tap-event-plugin'
// injectTapEventPlugin()

const muiTheme = getMuiTheme({
  palette: {
    primary1Color : green500,
    primary2Color : indigo700,
    accent1Color : redA200,
    pickerHeaderColor : green500,
  },
})


export class App extends React.Component {

  render = () => {
    const {
     children,
     classNames,
     locale,
     messages,
     user,
     router
   } = this.props
    return (
      <IntlProvider locale={locale}
        messages={messages}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className={ classNames }>
            {React.cloneElement(children, {user, router})}
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    )
  }
}

App.propTypes = {
  children : PropTypes.node,
  classNames : PropTypes.string,
  locale : PropTypes.string,
  messages : PropTypes.object,
  user : PropTypes.object,
  router : PropTypes.object,
  loadUser : PropTypes.func
}

App.defaultProps = {
  locale: 'en',
  messages : messages['en']
}

export default App
