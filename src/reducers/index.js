import {API} from '../actions';

export default function api(state = {}, action) {
  const json = action.json;

  switch (action.type) {
    case API:
      return {
        ...state,
        ...json,
      };
    default:
      return state;
  }
}
