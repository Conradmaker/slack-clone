import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { IChannel, IUser } from '../../types/db';
import { CollapseButton } from '../DMList/styles';

type ChannelListPropTypes = {
  channelData?: IChannel[];
  userData?: IUser;
};
export default function ChannelList({
  userData,
  channelData,
}: ChannelListPropTypes): JSX.Element {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{
    [key: string]: number | undefined;
  }>({});
  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse(prev => !prev);
  }, []);
  const resetCount = useCallback(
    id => () => {
      setCountList(list => {
        return {
          ...list,
          [id]: undefined,
        };
      });
    },
    []
  );
  useEffect(() => {
    setCountList({});
  }, [workspace, location]);
  return (
    <>
      <h2>
        <CollapseButton
          collapse={channelCollapse}
          onClick={toggleChannelCollapse}
        >
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map(channel => {
            const count = countList[`c-${channel.id}`];
            return (
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
                onClick={resetCount(`c-${channel.id}`)}
              >
                <span
                  className={
                    count !== undefined && count >= 0 ? 'bold' : undefined
                  }
                >
                  # {channel.name}
                </span>
                {count !== undefined && count > 0 && (
                  <span className="count">{count}</span>
                )}
              </NavLink>
            );
          })}
      </div>
    </>
  );
}
