import _ from 'lodash';
import ChatUI from './components/ChatUI';
import LoginUI from './components/LoginUI';
import useAuth from './hooks/useAuth';

const App = () => {
  const { token, streamToken, user } = useAuth();

  if (!token || !streamToken || _.isEmpty(user)) return <LoginUI />;

  return <ChatUI />;
};

export default App;
