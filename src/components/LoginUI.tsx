import React, { useCallback, useState } from 'react';
import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import {
  loginUser as _loginUser,
  registerUser as _registerUser,
} from '../actions/auth';
import Form from './Form';
import useAuth from '../hooks/useAuth';

const LoginUI = () => {
  const { setToken, setStreamToken, setUser } = useAuth();
  const [value, setValue] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginUser = useCallback(
    async (payload: { username: string; password: string }) => {
      const [err1, res1, user1] = await _loginUser(payload);

      if (!err1) {
        setToken(res1.token);
        setStreamToken(res1.streamToken);
        setUser(user1);
        return;
      }

      if (err1.response?.status === 404) {
        const [err2, res2, user2] = await _registerUser(payload);

        if (err2) return;

        setToken(res2.token);
        setStreamToken(res2.streamToken);
        setUser(user2);
      }
    },
    [setToken, setStreamToken, setUser]
  );

  const onSubmit = async () => {
    setIsSubmitting(true);
    await loginUser(value);
    setIsSubmitting(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof typeof value;

    setValue((curr) => ({
      ...curr,
      [key]: e.target.value,
    }));
  };

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void onSubmit();
      }}
      w={'100vw'}
      h={'100vh'}
    >
      <Flex
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        h={'100%'}
        w={'100%'}
      >
        <Flex rowGap={5} flexDirection={'column'} width={'35%'}>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Username"
              name={'username'}
              disabled={isSubmitting}
              onChange={onChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              name={'password'}
              disabled={isSubmitting}
              onChange={onChange}
            />
          </FormControl>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Login
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
};

export default LoginUI;
