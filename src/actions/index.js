export const API = 'API';

function api(json) {
  return {
    type: API,
    json,
  };
}

export function fetchData() {
  return dispatch => {
    fetch('/api')
      .then(response => response)
      .then(response => response.json())
      .then(json => {
        dispatch(api(json));
      });
  };
}
