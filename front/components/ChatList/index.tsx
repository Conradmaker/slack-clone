import React, { useCallback } from 'react';
import { IChat, IDM } from '../../types/db';
import Chat from '../Chat';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'core-js/es/object/from-entries';

type ChatListPropTypes = {
  chatSections: { [key: string]: (IDM | IChat)[] };
  isReachingEnd: boolean;
  isEmpty: boolean;
  scrollbarRef: React.RefObject<Scrollbars>;
  setSize: (
    size: number | ((size: number) => number)
  ) => Promise<(IDM | IChat)[][] | undefined>;
};
function ChatList({
  chatSections,
  isEmpty,
  isReachingEnd,
  setSize,
  scrollbarRef,
}: ChatListPropTypes): JSX.Element {
  const onScroll = useCallback(
    values => {
      if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
        setSize(size => size + 1).then(() => {
          scrollbarRef.current?.scrollTop(
            scrollbarRef.current?.getScrollHeight() - values.scrollHeight
          );
        });
      }
    },
    [setSize, scrollbarRef, isReachingEnd, isEmpty]
  );
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map(chat => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
}
export default ChatList;
