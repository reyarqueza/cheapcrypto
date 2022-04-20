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
    const responsePayload = jwtDecode(response.credential);

    console.log('ID: ' + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log('Image URL: ' + responsePayload.picture);
    console.log('Email: ' + responsePayload.email);
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
