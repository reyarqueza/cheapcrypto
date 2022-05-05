import React, {useContext} from 'react';
import {useQueryClient, useQuery, useMutation} from 'react-query';
import fetch from 'cross-fetch';
import {UserContext} from '../context';
import { Button } from '@mui/material';

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

  const collectionIds = data && data.map(coin => coin.id);
  const operation = collectionIds && collectionIds.includes(collectionValue) ? 'remove' : 'add';
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
      <Button onClick={handleAddRemove} color="primary" align="center" variant="contained">
        {`${operation} ${operation === 'add' ? 'to' : 'from'}`} watchlist
      </Button>
    </div>
  );
}
