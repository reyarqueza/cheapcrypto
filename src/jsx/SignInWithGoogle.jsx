import React, {Component} from 'react';
import jwtDecode from 'jwt-decode';

export class SignInWithGoogle extends Component {
  constructor(props) {
    super(props);
    // avoid SSR, sorry no isomorphic here.
    if (typeof process !== 'object') {
      window.handleCredentialResponse = this.handleCredentialResponse;
    }
  }

  handleCredentialResponse(response) {
    const credential = jwtDecode(response.credential);
    const params = new URLSearchParams({
      firstName: credential.given_name,
      lastName: credential.family_name,
      picture: credential.picture,
      id: credential.sub,
    });
    const urlString = `/signin?${params.toString()}`;

    fetch(urlString, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(json => {
        console.log('login done', json);
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <div
          id="g_id_onload"
          data-client_id={process.env.GOOGLE_SIGN_IN_CLIENT_ID}
          data-callback={'handleCredentialResponse'}
          data-login_uri="https://cheapcrypto.app/"
          data-auto_prompt="false"
        ></div>
        <div
          className="g_id_signin"
          data-type="standard"
          data-size="large"
          data-theme="outline"
          data-text="sign_in_with"
          data-shape="rectangular"
          data-logo_alignment="left"
        ></div>
      </div>
    );
  }
}
