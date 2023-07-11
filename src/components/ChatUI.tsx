import {
  Channel,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import useClient from '../hooks/useClient';
import CustomChannelHeader from './CustomChannelHeader';
import FloatingButton from './FloatingButton';
import useAuth from '../hooks/useAuth';
import { useMemo } from 'react';
import CustomChannelList from './CustomChannelList';

const ChatUI = () => {
  const { user: currentUser, streamToken: token } = useAuth();
  const user = useMemo(
    () => ({
      id: currentUser.uuid,
      username: currentUser.username,
      role: currentUser.role,
    }),
    [currentUser.role, currentUser.username, currentUser.uuid]
  );

  const chatClient = useClient({
    apiKey: import.meta.env.VITE_STREAM_KEY as string,
    token,
    user,
  });

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme="str-chat__theme-light">
      <CustomChannelList />
      <Channel>
        <Window>
          <CustomChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
      <FloatingButton />
    </Chat>
  );
};

export default ChatUI;
