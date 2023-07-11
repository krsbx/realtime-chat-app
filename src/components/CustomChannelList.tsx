import {
  ChannelList,
  ChannelPreviewUIComponentProps,
  ChannelPreviewMessenger,
} from 'stream-chat-react';
import useAuth from '../hooks/useAuth';
import { ChannelFilters, ChannelSortBase } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { useEffect, useState } from 'react';

export const CustomPreview = ({
  channel,
  ...props
}: ChannelPreviewUIComponentProps) => {
  const { user } = useAuth();
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    if (!channel || !user?.uuid) return;

    void channel
      .queryMembers({
        id: {
          $nin: [user.uuid],
        },
      })
      .then((value) => {
        setChannelName(value.members?.[0]?.user?.username ?? '');
      });
  }, [channel, user.uuid]);

  return (
    <ChannelPreviewMessenger
      channel={channel}
      {...props}
      displayTitle={channelName}
    />
  );
};

const CustomChannelList = () => {
  const { user } = useAuth();
  const filters = {
    type: 'messaging',
    members: { $in: [user.uuid] },
  } as ChannelFilters<DefaultStreamChatGenerics>;
  const sort = {
    last_message_at: -1,
  } as ChannelSortBase<DefaultStreamChatGenerics>;

  return <ChannelList Preview={CustomPreview} filters={filters} sort={sort} />;
};

export default CustomChannelList;
