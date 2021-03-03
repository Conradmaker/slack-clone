import axios from 'axios';
import useSocket from '../../hooks/useSocket';
import AddCHMemberModal from '../../layouts/Workspace/AddCHMemberModal';
import { IChannel, IChat, IUser } from '../../types/db';
import fetcher from '../../utils/fetcher';
import makeSection from '../../utils/makeSection';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR, { useSWRInfinite } from 'swr';
import ChatBox from '../../components/ChatBox';
import ChatList from '../../components/ChatList';
import useInput from '../../hooks/useInput';
import Workspace from '../../layouts/Workspace';
import { Container, Header } from './styles';

export default function Channel(): JSX.Element {
  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, onChangeChat, setChat] = useInput('');
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const { workspace, channel } = useParams<{
    workspace: string;
    channel: string;
  }>();
  const [socket] = useSocket(workspace);
  const { data: myData } = useSWR<IUser>(`/api/users`, fetcher);
  const { data: channelData } = useSWR<IChannel>(
    `api/workspaces/${workspace}/channels/${channel}`,
    fetcher
  );
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IChat[]>(
    i =>
      `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${
        i + 1
      }`,
    fetcher
  );

  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher
  );

  const onToggleCHMember = useCallback(() => {
    setShowInviteChannelModal(prev => !prev);
  }, [showInviteChannelModal]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat(prevChatData => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: (myData as IUser).id,
            User: myData as IUser,
            ChannelId: (channelData as IChannel).id,
            Channel: channelData as IChannel,
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
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
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
    [chat, workspace, channel, myData, channelData, chatData]
  );

  const onMessage = (data: IChat) => {
    if (data.Channel.name === channel && (myData as IUser).id !== data.UserId) {
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
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, channel, myData]);
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, []);
  if (!channelMembersData || !myData || !chatData) {
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
          <span>#{channel}</span>
          <div className="header-right">
            <span>{channelMembersData?.length}</span>
            <button
              onClick={onToggleCHMember}
              className="c-button-unstyled p-ia__view_header__button"
              aria-label="Add people to #react-native"
              data-sk="tooltip_parent"
              type="button"
            >
              <i
                className="c-icon p-ia__view_header__button_icon c-icon--add-user"
                aria-hidden="true"
              />
            </button>
          </div>
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
      <AddCHMemberModal
        show={showInviteChannelModal}
        onCloseModal={onToggleCHMember}
      />
    </Workspace>
  );
}
