import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import 'stream-chat-react/dist/css/v2/index.css';
import './main.css';
import App from './App.tsx';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.Fragment>
);
