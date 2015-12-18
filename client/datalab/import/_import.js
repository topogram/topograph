Template.import.rendered = function() {
};

Template.import.onCreated( function() {
    Session.set( 'newLayerDataReady', false );
    Session.set( 'dataFields', [] );
    Session.set( 'hasLatLng', false );
    Session.set( 'hasDate', false );
    Session.set( 'hasWidth', false );
    Session.set( 'hasData2', false );
    Session.set( 'hasName', false );
    Session.set( 'hasArrow', false );
    Session.set( 'hasColor', false );
    Session.set( 'hasStar', false );//A IMPLE
    Session.set( 'hasGroup', false );
    Session.set( 'hasRepMethod', false );
    Session.set( 'newLayerType', undefined );

} );

Template.import.helpers( {
    getLayerType: function() {
        return Session.get( 'newLayerType' );
    },
    isEdges: function() {
        return Session.get( 'newLayerType' ) === 'edges' && Session.get( 'newLayerDataReady' );
    },
    isNodes: function() {
        return Session.get( 'newLayerType' ) === 'nodes' && Session.get( 'newLayerDataReady' );
    },
    getHasLatLng: function() {
        return Session.get( 'hasLatLng' );
    },
    getHasDate: function() {
        return Session.get( 'hasDate' );
    },
    getHasWidth: function() {
        return Session.get( 'hasWidth' );
    },
    getHasData2: function() {
        return Session.get( 'hasData2' );
    },
    getHasName: function() {
        return Session.get( 'hasName' );
    },
    getHasArrow: function() {
        return Session.get( 'hasArrow' );
    },
    getHasColor: function() {
        return Session.get( 'hasColor' );
    },
    getHasStar: function() {
        return Session.get( 'hasStar' );

    },
    getHasGroup: function() {
        return Session.get( 'hasGroup' );
        
    },
    getHasRepMethod: function() {
        return Session.get( 'hasRepMethod' );
    },
    getDataFields: function() {
        return Session.get( 'dataFields' );
    }
} );

Template.import.events( {
    'change #layerType': function( e, t ) {
        Session.set( 'newLayerType', e.currentTarget.value );
    },

    'keyup #layerData': function( e ) {
        e.preventDefault();

        //check all lines have the same nb of datum
        var lines = e.target.value.split( '\n' );
        //remove empty lines
        lines = lines.filter( function( line ) {
            return line != '';
        } );
        var nbDatum = lines[ 0 ].split( ',' ).length;
        // console.log( 'nbDatum:', nbDatum );

        if ( lines.filter( function( l ) {
            l.split( ',' ).length != nbDatum;
        } ).length != 0 ) {
            console.log( "all lines don't have the same nb of datum" );
        } else {
            console.log( "data seems safe" );

            var type = Session.get( 'newLayerType' );

            // TODO : make UI for those options
            var parsingOptions = {
                header: true
            };

            var data = Papa.parse( e.target.value, parsingOptions );
            console.log( data );

            if ( data.errors.length ) {
                for ( var i = 0; i < data.errors.length; i++ ) {
                    Session.set( 'newLayerDataReady', false );
                    var message = 'CSV parsing Error ';
                    if ( data.errors[ i ].row ) message += 'at row: ' + data.errors[ i ].row + ' ';
                    message += data.errors[ i ].message;
                    FlashMessages.sendError( message );
                }
            } else {
                var message = type + ' CSV parsed succesfully : ' + data.data.length + ' records';
                FlashMessages.sendSuccess( message );

                // keep data
                Session.set( 'newLayerDataReady', true );
                Session.set( 'dataFields', data.meta.fields );
            }
        }
    },

    'change #add-geo-info': function( event ) {
        Session.set( 'hasLatLng', event.target.checked );
    },
    'change #add-date-info': function( event ) {
        Session.set( 'hasDate', event.target.checked );
    },
    'change #add-width-info': function( event ) {
        Session.set( 'hasWidth', event.target.checked );
    },
    'change #add-Data2-info': function( event ) {
        Session.set( 'hasData2', event.target.checked );
    },
    'change #add-name-info': function( event ) {
        Session.set( 'hasName', event.target.checked );
    },
    'change #add-arrow-info': function( event ) {
        Session.set( 'hasArrow', event.target.checked );
    },
    'change #add-color-info': function( event ) {
        Session.set( 'hasColor', event.target.checked );
    },
    'change #add-star-info': function( event ) {
        Session.set( 'hasStar', event.target.checked );
    },
    'change #add-group-info': function( event ) {
        Session.set( 'hasGroup', event.target.checked );
    },
    'change #add-repMethod-info': function( event ) {
        Session.set( 'hasRepMethod', event.target.checked );
    },
    'submit #importForm': function( e ) {
        e.preventDefault();

        var self = this;
        console.log( self );

        // Get value from form elements
        var type = e.target.layerType.value,
            csv = e.target.layerData.value;

        // init 
        var srcField, targetField, idField, latField, lngField;

        // TODO : make UI for those options
        var parsingOptions = {
            header: true
        };

        var data = Papa.parse( csv, parsingOptions );
        console.log( data );

        // check for errors in CSV
        if ( data.errors.length || !Session.get( 'newLayerDataReady' ) ) {
            FlashMessages.sendError( 'CSV contains errors, please fix before submitting' );
            return; // end function
        }

        // check for errors in vars
        if ( type == 'edges' ) {
            srcField = e.target.srcField.value;
            targetField = e.target.targetField.value;
            if ( Session.get( 'hasDate' ) ) {
                dateField = e.target.dateField.value;
            }
            if ( Session.get( 'hasWidth' ) ) {
                widthField = e.target.widthField.value;
            }

            // check if src and target have been set correctly // TODO VERIFY DATEFIELD
            if ( !targetField || !srcField || ( targetField == srcField ) ) {
                FlashMessages.sendError( 'Please define source and target' );
                return;
            }
        } else if ( type == 'nodes' ) {
            idField = e.target.idField.value;

            // parse latitude / longitude
            if ( Session.get( 'hasLatLng' ) ) {
                latField = e.target.latField.value;
                lngField = e.target.lngField.value;

                // add nodes
                if ( !idField || !latField || !lngField || ( latField == lngField ) ) {
                    FlashMessages.sendError( 'Please define lat / lng / ID fields' );
                    return;
                }
            }
            if ( Session.get( 'hasDate' ) ) {
                dateField = e.target.dateField.value;
            }
            if ( Session.get( 'hasWidth' ) ) {
                widthField = e.target.widthField.value;
            }
            if ( Session.get( 'hasData2' ) ) {
                Data2Field = e.target.Data2Field.value;
            }
            if ( Session.get( 'hasName' ) ) {
                nameField = e.target.nameField.value;
            }
            if ( Session.get( 'hasArrow' ) ) {
                arrowField = e.target.arrowField.value;
            }
            if ( Session.get( 'hasColor' ) ) {
                colorField = e.target.colorField.value;
            }
            if ( Session.get( 'hasStar' ) ) {
                starField = e.target.starField.value;
            }
            if ( Session.get( 'hasRepMethod' ) ) {
                repMethodField = e.target.repMethodField.value;
            }
        }

        // parse data
        var parsedData = data.data.map( function( d ) {
            // parse geo coords
            var lat = 0,
                lng = 0;
            if ( Session.get( 'hasLatLng' ) ) {
                lat = d[ e.target.latField.value ];
                lng = d[ e.target.lngField.value ];
            };
            //parse dates
            var date = 0;
            if ( Session.get( 'hasDate' ) ) {
                date = d[ e.target.dateField.value ];
            };
            //parse width
            var width = 0;
            if ( Session.get( 'hasWidth' ) ) {
                width = d[ e.target.widthField.value ];
            };
            //parse data2
            var data2 = 0;
            if ( Session.get( 'hasData2' ) ) {
                data2 = d[ e.target.Data2Field.value ];
            };
            //parse name
            var nameE = 0;
            if ( Session.get( 'hasName' ) ) {
                nameE = d[ e.target.nameField.value ];
            };
            //parse arrow
            var arrow = 0;
            if ( Session.get( 'hasArrow' ) ) {
                arrow = d[ e.target.arrowField.value ];
            };
            //parse color
            var color = 0;
            if ( Session.get( 'hasColor' ) ) {
                color = d[ e.target.colorField.value ];
            };
            //parse star
            var star = 0;
            if ( Session.get( 'hasStar' ) ) {
                star = d[ e.target.starField.value ];
            };
            //parse group
            var group = 0;
            if ( Session.get( 'hasGroup' ) ) {
                group = d[ e.target.groupField.value ];
            };
            //parse repMethod
            var repMethod = "";
            if ( Session.get( 'hasrepMethod' ) ) {
                repMethod = d[ e.target.repMethodField.value ];
            };

            // parse data
            if ( type == 'nodes' ) return makeNode( self.topogramId, d[ idField ], 0, 0, lat, lng, width,data2, date, nameE, color, repMethod,star,group, d );
            else if ( type == 'edges' ) return makeEdge( self.topogramId, d[ srcField ], d[ targetField ],width,data2, date, nameE, color, repMethod, arrow,group, d );
        } );

        /// TODO : display loader
        if ( type == 'edges' ) {
            Meteor.call( 'batchInsertEdges', parsedData, function( edges ) {
                console.log( data.data.length, ' edges added' );
                FlashMessages.sendSuccess( 'Success ! : ' + data.data.length + ' edges created.' );
                // Router.go( '/topograms/' + self.topogramId + '/edges' );
            } )
        } else if ( type == 'nodes' ) {
            console.log( parsedData );
            Meteor.call( 'batchInsertNodes', parsedData, function( nodes ) {
                console.log( data.data.length, ' nodes added' );
                FlashMessages.sendSuccess( 'Success ! : ' + data.data.length + ' nodes created.' );
                // Router.go( '/topograms/' + self.topogramId + '/nodes' );
            } );
        }
        Router.go( '/topograms/' + self.topogramId );
    },

    'change #file-input': function( e ) {
        e.preventDefault();
        var file = e.target.files[ 0 ];
        if ( !file ) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function( e ) {
            var contents = e.target.result.split( '\n' ).filter( function( d ) {
                return d !== '';
            } ).join( '\n' );
            // console.log(contents);
            var element = document.getElementById( 'layerData' );
            element.innerHTML = contents;
        };
        reader.readAsText( file );
    }
} );
