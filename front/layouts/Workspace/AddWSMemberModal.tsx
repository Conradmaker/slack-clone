import axios from 'axios';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import useInput from '../../hooks/useInput';
import { Button, Input, Label } from '../../pages/SignUp/styles';

type CreateChannelPropTypes = {
  show: boolean;
  onCloseModal: () => void;
  revalidate: () => void;
};
export default function AddWSMemberModal({
  show,
  onCloseModal,
  revalidate,
}: CreateChannelPropTypes): JSX.Element {
  const params = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const onInviteMember = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(`/api/workspaces/${params.workspace}/members`, {
          email: newMember,
        })
        .then(() => {
          revalidate();
          onCloseModal();
          setNewMember('');
        })
        .catch(error => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [params.workspace, newMember]
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
