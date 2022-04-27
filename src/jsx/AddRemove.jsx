import React, {useContext} from 'react';
import {useQueryClient, useQuery, useMutation} from 'react-query';
import fetch from 'cross-fetch';

import {UserContext} from '../context';

export default function AddRemove(props) {
  const {collectionKey, collectionValue} = props;
  const user = useContext(UserContext).user;
  const {id, email} = user;
  const params = new URLSearchParams({
    id,
    email,
    collectionKey,
  });
  const {data} = useQuery(collectionKey, async () => {
    if (id) {
      return await fetch(`/get-user-collection?${params}`).then(response => response.json());
    }
  });
  const operation = data && data.includes(collectionValue.toString()) ? 'remove' : 'add';
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

  function handleAddRemove() {
    mutation.mutate({
      collectionKey,
      collectionValue,
      id,
      email,
      operation,
    });
  }

  if (Object.keys(user).length === 0) {
    return <div className="add-remove" />;
  }

  if (!data) {
    return <div className="add-remove" />;
  }

  return (
    <div className="add-remove">
      {operation === 'remove' ? 'This coin is in your watchlist' : null}
      <button onClick={handleAddRemove}>
        {`${operation} ${operation === 'add' ? 'to' : 'from'}`} watchlist
      </button>
    </div>
  );
}
