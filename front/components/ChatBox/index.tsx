import React, { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  ChatArea,
  EachMention,
  Form,
  MentionsTextarea,
  SendButton,
  Toolbox,
} from './styles';
import autosize from 'autosize';
import {
  Mention,
  OnChangeHandlerFunc,
  SuggestionDataItem,
} from 'react-mentions';
import fetcher from '../../utils/fetcher';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { IUser, IUserWithOnline } from '../../types/db';
import { useParams } from 'react-router';

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
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser | boolean>('/api/users/', fetcher);
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );
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
  const renderSuggestion: (
    suggestion: SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean
  ) => React.ReactNode = useCallback(
    (member, search, highlightedDisplay, index, focus) => {
      if (!memberData) {
        return null;
      }
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, {
              s: '20px',
              d: 'retro',
            })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData]
  );
  return (
    <ChatArea>
      <Form onSubmit={onSubmit}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={(onChangeChat as unknown) as OnChangeHandlerFunc}
          onKeyPress={onKeyDownEnter}
          inputRef={textAreaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            trigger="@"
            appendSpaceOnAdd
            data={
              memberData?.map(v => ({ id: v.id, display: v.nickname })) || []
            }
            renderSuggestion={renderSuggestion}
          />
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
