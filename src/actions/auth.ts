import { AxiosError } from 'axios';
import jwtDecode from 'jwt-decode';
import axios from './axios';

const decodeUserJwt = (payload: string) =>
  jwtDecode<{
    uuid: string;
    username: string;
    role: string;
  }>(payload);

export const loginUser = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const { data } = await axios.post<{
      code: number;
      data: {
        token: string;
        streamToken: string;
      };
      status: string;
    }>('/auth/login', payload);

    return [null, data.data, decodeUserJwt(data.data.token)] as const;
  } catch (err) {
    return [err as AxiosError, null, {}] as const;
  }
};

export const registerUser = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const { data } = await axios.post<{
      code: number;
      data: {
        token: string;
        streamToken: string;
      };
      status: string;
    }>('/auth/register', {
      ...payload,
      confirmPassword: payload.password,
    });

    return [null, data.data, decodeUserJwt(data.data.token)] as const;
  } catch (err) {
    return [err as AxiosError, null, {}] as const;
  }
};
