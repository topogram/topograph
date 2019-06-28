import React, { PropTypes } from 'react'
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton';
import ClearIcon from 'material-ui/svg-icons/content/clear'

import Markdown from 'react-remarkable'
import 'github-markdown-css'

const SelectedItem = ({
  el,
  cy,
  onUnfocusElement
}) => {

  const source= cy.filter(`node[id="${el.data.source}"]`),
    target=cy.filter(`node[id="${el.data.target}"]`)

  const title = el.group === 'nodes' ?
    el.data.name
    :
    `${source.data('name')} -> ${target.data('name')}`

  return (
    <Card
      onExpandChange={() => onUnfocusElement(el)}
      >
      <CardTitle
        showExpandableButton={true}
        title={title}
        titleStyle={{
          lineHeight :'1.3em',
          fontSize:'1.1em'
        }}
        subtitle={el.group}
        closeIcon={<ClearIcon />}
      />
      <CardText>
        {/* {
          el.group === 'nodes' ?
            <p>lat/lng : {`${lat}/${lng}`}</p>
            :
            <p>lat/lng : {`${lat}/${lng}`}</p>
        } */}
        {
          el.data.notes ?
            <Markdown source={el.data.notes} />
            :
            null
        }
      </CardText>
    </Card>
  )
}

SelectedItem.propTypes = {
  el : PropTypes.object.isRequired,
  cy : PropTypes.object.isRequired,
  onUnfocusElement : PropTypes.func.isRequired
}

export default SelectedItem
