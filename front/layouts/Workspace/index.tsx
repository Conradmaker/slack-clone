import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import useSWR from 'swr';
import gravatar from 'gravatar';
import fetcher from '../../utils/fetcher';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import ContextMenu from '../../components/ContextMenu';
import { IChannel, IUser } from '../../types/db';
import CreateWSModal from './CreateWSModal';
import CreateChannelModal from './CreateChannelModal';

function isUserData(target: IUser | boolean): target is IUser {
  return (target as IUser)?.nickname !== undefined;
}
type WorkspacePropTypes = {
  children: React.ReactNode;
};
export default function Workspace({
  children,
}: WorkspacePropTypes): JSX.Element {
  const history = useHistory();
  const params = useParams<{ workspace: string; channel: string }>();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkSpaceMenu, setShowWorkSpaceMenu] = useState(false);
  const [showCreateWSModal, setShowCreateWSModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const { data: userData, mutate, revalidate } = useSWR<IUser | boolean>(
    'http://localhost:8000/api/users/',
    fetcher
  );
  const { data: channelData, revalidate: revalidateChannel } = useSWR<
    IChannel[]
  >(
    userData
      ? `http://localhost:8000/api/workspaces/${params.workspace}/channels`
      : null,
    fetcher
  );

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:8000/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => mutate(false));
  }, []);

  const onToggleUserProfile = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, [showUserMenu]);

  const onToggleModal = useCallback(() => {
    setShowCreateWSModal(prev => !prev);
  }, [showCreateWSModal]);

  const onToggleWorkspaceMenu = useCallback(() => {
    setShowWorkSpaceMenu(prev => !prev);
  }, [showWorkSpaceMenu]);

  const onToggleCreateChannelModal = useCallback(() => {
    setShowWorkSpaceMenu(false);
    setShowCreateChannelModal(prev => !prev);
  }, []);

  if (!userData) {
    history.replace('/login');
  }
  if (!isUserData(userData)) {
    return null;
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onToggleUserProfile}>
            <ProfileImg
              src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })}
              alt={userData.nickname}
            />
          </span>
          {showUserMenu && (
            <ContextMenu
              style={{ right: '0px', top: '30px' }}
              onCloseModal={onToggleUserProfile}
              closeButton={true}
            >
              <ProfileModal>
                <img
                  src={gravatar.url(userData.nickname, {
                    s: '36px',
                    d: 'retro',
                  })}
                  alt={userData.nickname}
                />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </ContextMenu>
          )}
        </RightMenu>
      </Header>

      <WorkspaceWrapper>
        <Workspaces>
          {userData.Workspaces.map(v => (
            <Link key={v.id} to={`/workspace/${v.name}/channel/일반`}>
              <WorkspaceButton>
                {v.name.slice(0, 1).toUpperCase()}
              </WorkspaceButton>
            </Link>
          ))}
          <AddButton onClick={onToggleModal}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={onToggleWorkspaceMenu}>
            {params.workspace}
          </WorkspaceName>
          <MenuScroll>
            {showWorkSpaceMenu && (
              <ContextMenu
                onCloseModal={onToggleWorkspaceMenu}
                style={{ top: 95, left: 80 }}
                closeButton={true}
              >
                <WorkspaceModal>
                  <h2>{params.workspace}</h2>
                  <button>워크스페이스에 사용자 초대</button>
                  <button onClick={onToggleCreateChannelModal}>
                    채널 만들기
                  </button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
              </ContextMenu>
            )}
            {channelData?.map(v => (
              <div>{v.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
      <CreateWSModal
        show={showCreateWSModal}
        onCloseModal={onToggleModal}
        revalidate={revalidate}
      />
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onToggleCreateChannelModal}
        revalidate={revalidateChannel}
      />
    </div>
  );
}