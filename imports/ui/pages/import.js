import './import.html'
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Papa } from 'papaparse'
import { FlashMessages } from 'meteor/mrt:flash-messages'
import { Router } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery'

import { makeNode, makeEdge } from '../../api/modelsHelpers.js'

Template.import.onCreated( function() {
    this.newLayerDataReady = new ReactiveVar(false)
    this.dataFields = new ReactiveVar([])
    this.newLayerType= new ReactiveVar(undefined)

    var self = this
    this.parseData = function(csvData) {
      var lines = csvData.split( '\n' )

      //remove empty lines
      lines = lines.filter( function( line ) {
          return line != ''
      } )

      //check all lines have the same nb of datum
      var nbDatum = lines[ 0 ].split( ',' ).length
      // console.log( 'nbDatum:', nbDatum )
      if ( lines.filter( function( l ) {
          l.split( ',' ).length != nbDatum
      } ).length != 0 ) {
          console.log( "all lines don't have the same nb of datum" )
      } else {
          console.log( "data seems safe" )

          // TODO : make UI for those options
          var parsingOptions = {
              header: true
          }

          var data = Papa.parse( csvData, parsingOptions )
          console.log( data )

          // check if there is any points in the fields
          data.meta.fields.forEach(function(fieldName){
            if(fieldName.split(".").length > 1) {
              data.errors.push({
                "message" : "the column name'"+ fieldName + "' contains the forbidden character : '.'"
              })
            }
          })

          if ( data.errors.length ) {
              for ( var error in data.errors) {
                  self.newLayerDataReady.set(false)

                  var msg = 'CSV parsing Error '
                  if ( error.row ) msg += 'at row: ' + error.row + ' '
                  message += error.message
                  FlashMessages.sendError( msg )
              }
          } else {
              var message = 'CSV parsed succesfully : ' + data.data.length + ' records'
              FlashMessages.sendSuccess( message )

              // keep data
              self.newLayerDataReady.set(true )
              self.dataFields.set(data.meta.fields)
          }
      }
    }
})

Template.import.helpers( {
    dataIsReady: function() {
        return Template.instance().newLayerDataReady.get()
    },
    getLayerType: function() {
        return Template.instance().newLayerType.get()
    },
    isEdges: function() {
        return Template.instance().newLayerType.get() === 'edges' && Template.instance().newLayerDataReady.get()
    },
    isNodes: function() {
        return Template.instance().newLayerType.get() === 'nodes' && Template.instance().newLayerDataReady.get()
    },
    getDataFields: function() {
        return Template.instance().dataFields.get()
    }
} )

Template.import.events( {

    'change #file-input': function( event, instance ) {
        event.preventDefault()
        var file = event.target.files[ 0 ]
        if ( !file ) {
            return
        }
        var reader = new FileReader()
        reader.onload = function( e ) {

            // add to textarea
            var contents = e.target.result.split( '\n' ).filter( function( d ) {
                return d !== ''
            } ).join( '\n' )
            instance.parseData(contents)
            var element = document.getElementById( 'layerData' )
            element.innerHTML = contents
        }
        reader.readAsText( file )
    },

    'click .validateImportData': function( event, instance ) {
        event.preventDefault()
        var lines = $("#importFileUpload textarea").val()
        instance.parseData(lines)
    },

    'change #layerType': function( event, instance ) {
        instance.newLayerType.set( event.currentTarget.value )
        $(".collapsible").collapsible()
    },

    'submit #importForm': function( event ) {
        event.preventDefault()

        var self = this

        // Get value from form elements
        var type = event.target.layerType.value, // nodes or edges
            csv = event.target.layerData.value  // csv data

        // init
        // var srcField, targetField, idField, latField, lngField

        // TODO : make UI for those options
        var parsingOptions = {
            header: true
        }

        var data = Papa.parse( csv, parsingOptions )
        console.log( data )

        // check for errors in CSV
        if ( data.errors.length || !Template.instance().newLayerDataReady.get() ) {
            FlashMessages.sendError( 'CSV contains errors, please fix before submitting' )
            return  // end function
        }

        if( ! $(event.target).find("select.importField").length) {
          FlashMessages.sendError( 'Please select a type for your data' )
          return
        }

        // get all active select fields
        var selected = {}
        $(event.target).find("select.importField").each(function(i, select) {
          return selected[select.id] = select.value
        })

        console.log(data, selected)

        // check for errors in vars
        if ( type == 'edges' ) {
            // check if src and target have been set correctly
            if ( !selected.targetField || !selected.sourceField || ( selected.targetField == selected.sourceField ) ) {
                FlashMessages.sendError( 'Please define source and target' )
                return
            }
        }
        else if ( type == 'nodes' ) {
          if ( !selected.idField ) {
              FlashMessages.sendError( 'Please define ID field for your nodes' )
              return
          }
        }
        // TODO Verify optional fields



        // parse data
        var parsedData = data.data.map(function(d) {
          console.log(d)

          // parse csv data
          var cleanData = {}
          for (var key in selected) {

            var cleanKey = key.replace("Field", "")  // get key from field name
            var csvKey = selected[key]  // proper row name from csv
            cleanData[cleanKey] = d[ csvKey ]
          }

          // create nodes and edges
          if ( type == 'nodes' )
            return makeNode(self.topogramId, cleanData, d)
          else if ( type == 'edges' )
            return makeEdge(self.topogramId, cleanData, d)

        })
        console.log(parsedData)

        // save data
        // TODO : display loader
        if ( type == 'edges' ) {
            Meteor.call( 'batchInsertEdges', parsedData, function( edges ) {
                console.log(edges.length)
                console.log( data.data.length, "/", edges.length , ' edges added' )
                FlashMessages.sendSuccess( 'Success ! : ' + data.data.length + ' edges created.' )
                FlowRouter.go( '/topograms/' + self.topogramId + '/lab' )
            })
        } else if ( type == 'nodes' ) {
            Meteor.call( 'batchInsertNodes', parsedData, function( nodes ) {
                console.log( data.data.length, '/', nodes.length, ' nodes added' )
                FlashMessages.sendSuccess( 'Success ! : ' + data.data.length + ' nodes created.' )
                FlowRouter.go( '/topograms/' + self.topogramId + '/lab' )
            })
        }
    }
} )
