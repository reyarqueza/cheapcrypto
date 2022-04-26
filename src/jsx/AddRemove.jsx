import React from 'react';
import {useQueryClient, useMutation} from 'react-query';
import fetch from 'cross-fetch';

import {UserContext} from '../context';

export default function AddRemove(props) {
  const {collectionKey, collectionValue} = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(
    listItem => {
      const paramString = new URLSearchParams(listItem).toString();
      return fetch(`/update-user-collection?${paramString}`, {
        method: 'POST',
      }).then(response => response.json());
    },
    {
      onSuccess: data => {
        console.log('onSuccess data', data);
        queryClient.setQueryData(collectionKey, data);
        queryClient.invalidateQueries(collectionKey);
      },
    }
  );

  function handleAddRemove({id, email}) {
    mutation.mutate({
      collectionKey,
      collectionValue,
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
