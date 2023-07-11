import { useEffect, useState } from 'react';
import { ChannelHeader, useChatContext } from 'stream-chat-react';
import useAuth from '../hooks/useAuth';

const CustomChannelHeader = () => {
  const { user } = useAuth();
  const { channel } = useChatContext();
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

  return <ChannelHeader title={channelName} />;
};

export default CustomChannelHeader;
