import React, { useCallback } from 'react';
import ChatBox from '../../components/ChatBox';
import ChatList from '../../components/ChatList';
import useInput from '../../hooks/useInput';
import Workspace from '../../layouts/Workspace';
import { Container, Header } from './styles';

export default function Channel(): JSX.Element {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChat('');
  }, []);
  return (
    <Workspace>
      <Container>
        <Header>채널!</Header>
        <ChatList />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmit={onSubmit} />
      </Container>
    </Workspace>
  );
}
