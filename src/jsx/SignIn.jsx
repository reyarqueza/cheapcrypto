import React, {useState, useContext} from 'react';
import {useQueryClient} from 'react-query';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import ReactImageFallback from 'react-image-fallback';
import {UserContext} from '../context';

export default function SignIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const queryClient = useQueryClient();

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
        // tell React Query to refetch all queries.. doesnt' seem to be working..
        // TODO, get queries to run after user context is loaded.
        //console.log('about to invalidate');
        //queryClient.invalidateQueries();
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
    <div>
      {user.email}
      <br />
      {user.firstName}
      <br />
      {user.lastName}
      <br />
      <ReactImageFallback
        src={user.picture}
        fallbackImage="/images/icon-person.svg"
        alt="cool image should be here"
        className="my-image"
      />
      <br />
      Joined on {Date(user.joinDate)}
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
