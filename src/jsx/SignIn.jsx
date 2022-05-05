import React, {useState, useContext} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import {UserContext} from '../context';

import {Avatar, Chip} from '@mui/material';
import {deepOrange} from '@mui/material/colors';

export default function SignIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const handleSuccess = response => {
    const {email, givenName, googleId, familyName, imageUrl} = response && response.profileObj;
    const params = new URLSearchParams({
      firstName: givenName,
      lastName: familyName,
      picture: imageUrl,
      id: googleId,
      email,
    });
    const urlString = `/signin?${params.toString()}`;

    fetch(urlString, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(json => {
        setIsLoggedIn(true);
        setUser(json);
      })
      .catch(error => console.log(error));
  };

  const handleFailure = response => {
    console.log(response);
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setUser({});
  };

  return isLoggedIn ? (
    <GoogleLogout
      clientId={process.env.GOOGLE_SIGN_IN_CLIENT_ID}
      buttonText="Sign Out"
      onLogoutSuccess={handleLogoutSuccess}
      onFailure={handleFailure}
      icon={false}
      render={renderProps => (
        <Chip
          onClick={renderProps.onClick}
          avatar={
            <Avatar sx={{bgcolor: deepOrange[500]}} src={user.picture} alt={user.firstName} />
          }
          label="Sign Out"
          color="primary"
        />
      )}
    />
  ) : (
    <GoogleLogin
      clientId={process.env.GOOGLE_SIGN_IN_CLIENT_ID}
      buttonText="Sign In"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={'single_host_origin'}
      theme="dark"
      isSignedIn={true}
    />
  );
}
