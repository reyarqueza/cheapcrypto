import React from 'react';
import {useQuery, useMutation} from 'react-query';
import fetch from 'cross-fetch';

import {UserContext} from '../context';

export default function AddRemove(props) {
  const {list, value} = props;

  const mutation = useMutation(listItem => {
    const paramString = new URLSearchParams(listItem).toString();
    return fetch(`/add-to-user-collection?${paramString}`, {
      method: 'POST',
    }).then(response => response.json());
  });

  function handleAddRemove({id, email}) {
    mutation.mutate({
      collectionKey: list,
      collectionValue: value,
      id,
      email,
    });
  }

  return (
    <UserContext.Consumer>
      {user => {
        if (!user) {
          return <div className="add-remove"></div>;
        }

        return (
          <div className="add-remove">
            <button
              onClick={() => {
                handleAddRemove(user.user);
              }}
            >
              Add to watchlist
            </button>
            {mutation.isLoading ? (
              <p>Adding...</p>
            ) : (
              <>
                {mutation.isError ? <p>Error: {mutation.error.message}</p> : null}

                {mutation.isSuccess ? <div>Added to watchlist!</div> : null}
              </>
            )}
          </div>
        );
      }}
    </UserContext.Consumer>
  );
}
