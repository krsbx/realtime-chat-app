import {
  DefaultGenerics,
  OwnUserResponse,
  StreamChat,
  TokenOrProvider,
  UserResponse,
} from 'stream-chat';
import { useState, useEffect } from 'react';

type Params = {
  apiKey: string;
  user: OwnUserResponse<DefaultGenerics> | UserResponse<DefaultGenerics>;
  token: TokenOrProvider;
};

const useClient = ({ apiKey, token, user }: Params) => {
  const [chatClient, setChatClient] =
    useState<StreamChat<DefaultGenerics> | null>(null);

  useEffect(() => {
    const client = new StreamChat(apiKey);
    // prevents application from setting stale client (user changed, for example)
    let didUserConnectInterrupt = false;

    const connection = client.connectUser(user, token).then(() => {
      if (didUserConnectInterrupt) return;

      setChatClient(client);
      console.log('Connected');
    });

    return () => {
      didUserConnectInterrupt = true;
      setChatClient(null);
      // wait for connection to finish before initiating closing sequence
      void connection
        .then(() => client.disconnectUser())
        .then(() => {
          console.log('Connection Closed');
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, token, user.id]);

  return chatClient;
};

export default useClient;
