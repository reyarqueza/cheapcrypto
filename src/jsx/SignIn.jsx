import React, {useState, useContext} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import {deepOrange} from '@mui/material/colors';
import {UserContext} from '../context';

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
    <Stack direction="row" spacing={2}>
      <Avatar sx={{bgcolor: deepOrange[500]}} src={user.picture} alt={user.firstName} />
      <GoogleLogout
        clientId={process.env.GOOGLE_SIGN_IN_CLIENT_ID}
        buttonText="Sign Out"
        onLogoutSuccess={handleLogoutSuccess}
        onFailure={handleFailure}
        theme="dark"
      ></GoogleLogout>
    </Stack>
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
