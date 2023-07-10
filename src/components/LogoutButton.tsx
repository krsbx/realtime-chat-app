import { Button } from '@chakra-ui/react';
import { RiLogoutCircleLine } from 'react-icons/ri';
import useAuth from '../hooks/useAuth';

const LogoutButton = () => {
  const { setToken, setStreamToken, setUser } = useAuth();

  const logout = () => {
    setToken('');
    setStreamToken('');
    setUser(
      {} as {
        uuid: string;
        username: string;
        role: string;
      }
    );
  };

  return (
    <Button
      width={'56px'}
      height={'56px'}
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius={'full'}
      cursor={'pointer'}
      backgroundColor={'transparent'}
      color={'blackAlpha.700'}
      padding={2}
      _hover={{
        color: 'black',
      }}
      transition={'all 0.2s ease-in-out'}
      onClick={logout}
    >
      <RiLogoutCircleLine size={'2.5rem'} />
    </Button>
  );
};

export default LogoutButton;
