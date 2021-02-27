import axios from 'axios';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';

type WorkspacePropTypes = {
  children: React.ReactNode;
};
export default function Workspace({
  children,
}: WorkspacePropTypes): JSX.Element {
  const history = useHistory();
  const { data: userData, mutate } = useSWR(
    'http://localhost:8000/api/users/',
    fetcher
  );
  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:8000/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => mutate(false));
  }, []);

  if (!userData) {
    history.replace('/login');
  }
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
}
