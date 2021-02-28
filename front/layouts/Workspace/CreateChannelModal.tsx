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
export default function CreateChannelModal({
  show,
  onCloseModal,
  revalidate,
}: CreateChannelPropTypes): JSX.Element {
  const params = useParams<{ workspace: string; channel: string }>();
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const onCreateChannel = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      axios
        .post(
          `http://localhost:8000/api/workspaces/${params.workspace}/channels`,
          {
            name: newChannel,
          },
          { withCredentials: true }
        )
        .then(() => {
          revalidate();
          onCloseModal();
          setNewChannel('');
        })
        .catch(e => {
          console.error(e);
          toast.error(e.response.data, { position: 'bottom-center' });
        });
    },
    [newChannel]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>워크스페이스 이름</span>
          <Input
            id="channel"
            value={newChannel}
            onChange={onChangeNewChannel}
          />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
}
