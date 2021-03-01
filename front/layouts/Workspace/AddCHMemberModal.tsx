import axios from 'axios';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Modal from '../../components/Modal';
import useInput from '../../hooks/useInput';
import { Button, Input, Label } from '../../pages/SignUp/styles';
import { IUser } from '../../types/db';
import fetcher from '../../utils/fetcher';

type AddCHMemberModalPropTypes = {
  show: boolean;
  onCloseModal: () => void;
  revalidate?: () => void;
};
export default function AddCHMemberModal({
  show,
  onCloseModal,
  revalidate,
}: AddCHMemberModalPropTypes): JSX.Element {
  console.log(revalidate);
  const { workspace, channel } = useParams<{
    workspace: string;
    channel: string;
  }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { revalidate: revalidateMembers } = useSWR<IUser[]>(
    userData && channel
      ? `/api/workspaces/${workspace}/channels/${channel}/members`
      : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  const onInviteMember = useCallback(
    e => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
          email: newMember,
        })
        .then(() => {
          revalidateMembers();
          onCloseModal();
          setNewMember('');
        })
        .catch(error => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input
            id="member"
            type="email"
            value={newMember}
            onChange={onChangeNewMember}
          />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
}
