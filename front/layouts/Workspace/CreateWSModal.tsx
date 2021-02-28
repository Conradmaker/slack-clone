import React from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import useInput from '../../hooks/useInput';
import { Button, Input, Label } from '../../pages/SignUp/styles';

type CreateWSModalPropTypes = {
  onCloseModal: () => void;
  show: boolean;
  revalidate: () => void;
};
export default function CreateWSModal({
  onCloseModal,
  show,
  revalidate,
}: CreateWSModalPropTypes): JSX.Element {
  const [newWorkSpace, onChangeNewWorkSpace, setNewWorkSpace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const onCreateWorkspace = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newWorkSpace || !newWorkSpace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post('/api/workspaces', {
          workspace: newWorkSpace,
          url: newUrl,
        })
        .then(() => {
          revalidate();
          setNewWorkSpace('');
          setNewUrl('');
          onCloseModal();
        })
        .catch(e => {
          console.error(e);
          toast.error(e.response.data, { position: 'bottom-center' });
        });
    },
    [newWorkSpace, newUrl]
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateWorkspace}>
        <Label id="workspace-label">
          <span>워크스페이스 이름</span>
          <Input
            id="workspace"
            value={newWorkSpace}
            onChange={onChangeNewWorkSpace}
          />
        </Label>
        <Label id="workspace-label">
          <span>워크스페이스 url</span>
          <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
}
