import React, { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  ChatArea,
  Form,
  MentionsTextarea,
  SendButton,
  Toolbox,
} from './styles';
import autosize from 'autosize';

type ChatBoxPropTypes = {
  chat: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangeChat: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};
export default function ChatBox({
  chat,
  onSubmit,
  onChangeChat,
}: ChatBoxPropTypes): JSX.Element {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const onKeyDownEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (chat === '' || chat.trim() === '') {
        return toast.error('올바르게 입력해주세요', { position: 'top-right' });
      }
      if (e.key === 'Enter') {
        onSubmit((e as unknown) as React.FormEvent<HTMLFormElement>);
      }
    },
    [chat]
  );
  useEffect(() => {
    if (textAreaRef.current) {
      autosize(textAreaRef.current);
    }
  }, []);
  return (
    <ChatArea>
      <Form onSubmit={onSubmit}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyPress={onKeyDownEnter}
          ref={textAreaRef}
        >
          <textarea />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i
              className="c-icon c-icon--paperplane-filled"
              aria-hidden="true"
            />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
}
