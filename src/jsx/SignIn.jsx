import React, {useState} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import ReactImageFallback from 'react-image-fallback';

export default function SignIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileObj, setProfileObj] = useState({});

  const handleSuccess = response => {
    setIsLoggedIn(true);
    setProfileObj(response.profileObj);
  };

  const handleFailure = response => {
    console.log(response);
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setProfileObj({});
  };

  return isLoggedIn ? (
    <div>
      {profileObj.email}
      <br />
      {profileObj.givenName}
      <br />
      {profileObj.familyName}
      <br />
      <ReactImageFallback
        src={profileObj.imageUrl}
        fallbackImage="/images/icon-person.svg"
        alt="cool image should be here"
        className="my-image"
      />
      <br />
      <GoogleLogout
        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
        buttonText="Sign Out"
        onLogoutSuccess={handleLogoutSuccess}
        onFailure={handleFailure}
        theme="dark"
      ></GoogleLogout>
    </div>
  ) : (
    <GoogleLogin
      clientId={process.env.GOOGLE_SIGN_IN_CLIENT_ID}
      buttonText="Sign In with Google"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={'single_host_origin'}
      theme="dark"
      isSignedIn={true}
    />
  );
}
