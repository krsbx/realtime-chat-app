import { useEffect, useState } from 'react';
import { ChannelHeader, useChatContext } from 'stream-chat-react';
import useAuth from '../hooks/useAuth';

const CustomChannelHeader = () => {
  const { user } = useAuth();
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState<string | undefined>();

  useEffect(() => {
    if (!channel || !user?.uuid) return;

    void channel
      .queryMembers({
        id: {
          $nin: [user.uuid],
        },
      })
      .then((value) => {
        if (value.members.length > 1) {
          setChannelName(undefined);
          return;
        }

        setChannelName(value.members?.[0]?.user?.username);
      });
  }, [channel, user.uuid]);

  return <ChannelHeader title={channelName} />;
};

export default CustomChannelHeader;
