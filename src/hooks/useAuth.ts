import { useLocalStorage } from 'usehooks-ts';

const useAuth = () => {
  const [token, setToken] = useLocalStorage('token', '');
  const [streamToken, setStreamToken] = useLocalStorage('streamToken', '');
  const [user, setUser] = useLocalStorage(
    'user',
    {} as {
      uuid: string;
      username: string;
      role: string;
    }
  );

  return {
    token,
    setToken,
    streamToken,
    setStreamToken,
    user,
    setUser,
  };
};

export default useAuth;
