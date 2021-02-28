import React from 'react';
import { CloseModalButton } from '../ContextMenu/styles';
import { CreateModal } from './styles';

type ModalPropTypes = {
  children: React.ReactNode;
  show: boolean;
  onCloseModal: () => void;
};

export default function Modal({
  show,
  children,
  onCloseModal,
}: ModalPropTypes): JSX.Element {
  if (!show) return null;
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={e => e.stopPropagation()}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
}
