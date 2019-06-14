const initialState = {
  filterPanelIsOpen: true,
  // filters
  minTime : null,
  maxTime : null,
  currentSliderTime : () => new Date().getTime(), // TODO set default to minTime
  selectedNodeCategories: [],
  // viz layout settings
  graphVisible : true, // default to graph view
  geoMapVisible : false,
  timeLineVisible : false,
  // network/map
  layoutName : 'preset',
  nodeRadius : 'degree',
  geoMapTile : 'default',
  // selection
  selectedElements : [],
  focusElement: null,
  cy : null, // cytoscape graph
  // isolate
  isolateMode : false,
  prevPositions : null
}

export function ui(state = initialState, action) {
  switch (action.type) {
    case 'SET_CY_INSTANCE':
      return {
        ...state,
        cy: action.cy
      }
    case 'SET_NODES_SELECTED_CATEGORIES':
      return {
        ...state,
        selectedNodeCategories: action.selectedNodeCategories
      }
    default:
      return state
  }
}
