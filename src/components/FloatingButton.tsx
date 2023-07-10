import { Flex } from '@chakra-ui/react';
import CreateChannelBubble from './CreateChannelBubble';
import LogoutButton from './LogoutButton';

const FloatingButton = () => {
  return (
    <Flex flexDirection={'column'} position={'fixed'} bottom={10} left={5}>
      <LogoutButton />
      <CreateChannelBubble />
    </Flex>
  );
};

export default FloatingButton;
