import React, { useCallback, forwardRef } from 'react';
import { IDM } from '../../types/db';
import Chat from '../Chat';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'core-js/es/object/from-entries';

type ChatListPropTypes = {
  chatSections: { [key: string]: IDM[] };
  isReachingEnd: boolean;
  isEmpty: boolean;
  setSize: (
    size: number | ((size: number) => number)
  ) => Promise<IDM[][] | undefined>;
};
function ChatList(
  { chatSections, isEmpty, isReachingEnd, setSize }: ChatListPropTypes,
  ref: React.MutableRefObject<Scrollbars>
): JSX.Element {
  const onScroll = useCallback(
    values => {
      if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
        setSize(size => size + 1).then(() => {
          ref.current?.scrollTop(
            ref.current?.getScrollHeight() - values.scrollHeight
          );
        });
      }
    },
    [setSize, ref, isReachingEnd, isEmpty]
  );
  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
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
export default forwardRef(ChatList);
