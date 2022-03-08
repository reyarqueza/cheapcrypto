import {API} from '../actions';
import json from '../../public/json/api.json';

export default function api(state = {...json}, action) {
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
