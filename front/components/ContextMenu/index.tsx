import React from 'react';
import { CloseModalButton, CreateMenu } from './styles';

type ContextMenuPropTypes = {
  children: React.ReactNode;
  style: React.CSSProperties;
  onCloseModal: () => void;
  closeButton: boolean;
};
export default function ContextMenu({
  children,
  style,
  onCloseModal,
  closeButton = true,
}: ContextMenuPropTypes): JSX.Element {
  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={e => e.stopPropagation()}>
        {closeButton && (
          <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        )}
        {children}
      </div>
    </CreateMenu>
  );
}
