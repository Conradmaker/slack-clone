import React, { useCallback, useEffect, useRef } from 'react';
import gravatar from 'gravatar';
import Workspace from '../../layouts/Workspace';
import { Container, Header } from './styles';
import useSWR, { useSWRInfinite } from 'swr';
import fetcher from '../../utils/fetcher';
import { useParams } from 'react-router';
import { IDM, IUser } from '../../types/db';
import ChatBox from '../../components/ChatBox';
import ChatList from '../../components/ChatList';
import useInput from '../../hooks/useInput';
import axios from 'axios';
import makeSection from '../../utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import { toast } from 'react-toastify';
import useSocket from '../../hooks/useSocket';

export default function DirectMessage(): JSX.Element {
  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, onChangeChat, setChat] = useInput('');
  const { workspace, userId } = useParams<{
    workspace: string;
    userId: string;
  }>();
  const [socket] = useSocket(workspace);

  //setSize는 페이지수를 바꾼다.
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IDM[]>(
    i =>
      `/api/workspaces/${workspace}/dms/${userId}/chats?perPage=20&page=${
        i + 1
      }`,
    fetcher
  );
  const { data: userData } = useSWR<IUser>(
    `/api/workspaces/${workspace}/users/${userId}`,
    fetcher
  );
  const { data: myData } = useSWR<IUser>(`/api/users`, fetcher);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat(prevChatData => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: (myData as IUser).id,
            Sender: myData as IUser,
            ReceiverId: (userData as IUser).id,
            Receiver: userData as IUser,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          if (scrollbarRef.current) {
            scrollbarRef.current.scrollToBottom();
          }
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${userId}/chats`, {
            content: chat,
          })
          .then(() => {
            revalidate();
            setChat('');
            scrollbarRef.current?.scrollToBottom();
          })
          .catch(e => console.error(e));
      }
    },
    [chat, workspace, userId, myData, userData, chatData]
  );

  const onMessage = (data: IDM) => {
    if (
      data.SenderId === Number(userId) &&
      (myData as IUser).id !== Number(userId)
    ) {
      mutateChat(chatData => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() +
              scrollbarRef.current.getScrollTop() +
              150
          ) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            scrollbarRef.current.scrollToBottom();
          } else {
            toast.success('새 메시지가 도착했습니다.', {
              onClick() {
                scrollbarRef.current?.scrollToBottom();
              },
              closeOnClick: true,
            });
          }
        }
      });
    }
  };
  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, userId, myData]);
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, []);
  if (!userData || !myData || !chatData) {
    return <div></div>;
  }
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20);
  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);
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
        <ChatList
          chatSections={chatSections}
          scrollbarRef={scrollbarRef}
          setSize={setSize}
          isReachingEnd={isReachingEnd}
          isEmpty={isEmpty}
        />
        <ChatBox chat={chat} onSubmit={onSubmit} onChangeChat={onChangeChat} />
      </Container>
    </Workspace>
  );
}
