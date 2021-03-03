import React, { useMemo, memo } from 'react';
import { IChat, IDM } from '../../types/db';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

const makeContent = (data: string, workspace: string) =>
  regexifyString({
    input: data,
    pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
    decorator(match, i) {
      const arr = match.match(/@\[(.+?)]\((\d+?)\)/);
      if (arr) {
        return (
          <Link key={match + i} to={`/workspace/${workspace}/dm/${arr[2]}`}>
            @{arr[1]}
          </Link>
        );
      }
      return <br key={i} />;
    },
  });

type ChatPropTypes = {
  data: IDM | IChat;
};
function Chat({ data }: ChatPropTypes): JSX.Element {
  const user = 'Sender' in data ? data.Sender : data.User;
  const { workspace } = useParams<{ workspace: string }>();

  const result = useMemo(() => makeContent(data.content, workspace), [
    data.content,
  ]);
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img
          src={gravatar.url(user.email, { s: '36px', d: 'retro' })}
          alt={user.nickname}
        />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm:ss')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
}

export default memo(Chat);
