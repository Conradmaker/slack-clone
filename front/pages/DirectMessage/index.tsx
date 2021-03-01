import React, { useCallback } from 'react';
import gravatar from 'gravatar';
import Workspace from '../../layouts/Workspace';
import { Container, Header } from './styles';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import { useParams } from 'react-router';
import { IDM, IUser } from '../../types/db';
import ChatBox from '../../components/ChatBox';
import ChatList from '../../components/ChatList';
import useInput from '../../hooks/useInput';
import axios from 'axios';

export default function DirectMessage(): JSX.Element {
  const [chat, onChangeChat, setChat] = useInput('');
  const { workspace, userId } = useParams<{
    workspace: string;
    userId: string;
  }>();

  const { data: chatData, mutate: mutateChat, revalidate } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${userId}/chats?perPage=20&page=1`,
    fetcher
  );
  const { data: userData } = useSWR<IUser>(
    `/api/workspaces/${workspace}/users/${userId}`,
    fetcher
  );
  const { data: myData } = useSWR(`/api/users`, fetcher);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(222);
      if (chat?.trim()) {
        console.log(111);
        axios
          .post(`/api/workspaces/${workspace}/dms/${userId}/chats`, {
            content: chat,
          })
          .then(() => {
            revalidate();
            setChat('');
          })
          .catch(e => console.error(e));
      }
    },
    [chat, workspace, userId]
  );

  if (!userData || !myData) {
    return null;
  }
  return (
    <Workspace>
      <Container>
        <Header>
          <img
            src={gravatar.url(userData.email, { s: '24px', d: 'retro' })}
            alt={userData.nickname}
          />
          <span>{userData.nickname}</span>
        </Header>
        <ChatList />
        <ChatBox chat={chat} onSubmit={onSubmit} onChangeChat={onChangeChat} />
      </Container>
    </Workspace>
  );
}
