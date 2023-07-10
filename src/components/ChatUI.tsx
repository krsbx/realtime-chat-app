import useClient from '../hooks/useClient';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import {
  ChannelFilters,
  ChannelSortBase,
  DefaultGenerics,
  OwnUserResponse,
  TokenOrProvider,
  UserResponse,
} from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import FloatingButton from './FloatingButton';

const ChatUI = ({ user, token }: Props) => {
  const filters = {
    type: 'messaging',
    members: { $in: [user.id] },
  } as ChannelFilters<DefaultStreamChatGenerics>;
  const sort = {
    last_message_at: -1,
  } as ChannelSortBase<DefaultStreamChatGenerics>;
  const chatClient = useClient({
    apiKey: import.meta.env.VITE_STREAM_KEY as string,
    user,
    token,
  });

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme="str-chat__theme-light">
      <ChannelList filters={filters} sort={sort} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
      <FloatingButton />
    </Chat>
  );
};

type Props = {
  user: OwnUserResponse<DefaultGenerics> | UserResponse<DefaultGenerics>;
  token: TokenOrProvider;
};

export default ChatUI;
