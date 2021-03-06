import {
  EDGES_LOADING,
  EDGES_LOADED
} from '../actions'

const initialState = {
  loading: false,
  ready: false,
  edges: []
}

export function edges(state = initialState, action) {
  switch (action.type) {
  case EDGES_LOADING:
    return {
      ...state,
      loading: true
    }
  case EDGES_LOADED:
    return {
      ...state,
      edges: action.payload,
      loading: false,
      ready: true
    }
  default:
    return state
  }
}
