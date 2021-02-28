import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
import { IUser } from '../../types/db';
import CreateWSModal from './CreateWSModal';

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWSModal, setShowCreateWSModal] = useState(false);
  const { data: userData, mutate, revalidate } = useSWR<IUser | boolean>(
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
  const onToggleUserProfile = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, [showUserMenu]);

  const onToggleModal = useCallback(() => {
    setShowCreateWSModal(prev => !prev);
  }, [showCreateWSModal]);

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
            <Link key={v.id} to={`/workspace/${v.id}/channel/일반`}>
              <WorkspaceButton>
                {v.name.slice(0, 1).toUpperCase()}
              </WorkspaceButton>
            </Link>
          ))}
          <AddButton onClick={onToggleModal}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>react</WorkspaceName>
          <MenuScroll>
            {/* <ContextMenu
              show={showWorkspaceModal}
              onCloseModal={toggleWorkspaceModal}
              style={{ top: 95, left: 80 }}
            >
              <WorkspaceModal>
                <h2>Slack</h2>
              </WorkspaceModal>
            </ContextMenu> */}
          </MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
      <CreateWSModal
        show={showCreateWSModal}
        onCloseModal={onToggleModal}
        revalidate={revalidate}
      />
    </div>
  );
}
