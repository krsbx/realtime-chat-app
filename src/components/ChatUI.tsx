import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { Flex, Spinner } from '@chakra-ui/react';
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
    return (
      <Flex
        justifyContent={'center'}
        alignItems={'center'}
        w={'100vw'}
        h={'100vh'}
      >
        <Spinner size={'xl'} />
      </Flex>
    );
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
