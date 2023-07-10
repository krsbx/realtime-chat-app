import { AxiosError } from 'axios';
import axios from './axios';

export type User = {
  uuid: string;
  username: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export const getUsers = async (query = '') => {
  try {
    const { data } = await axios.get<{
      data: User[];
      page: {
        size: number;
        total: number;
        totalPages: number;
        current: number;
      };
    }>(`/users?${query}`);

    return [null, data.data] as const;
  } catch (err) {
    return [err as AxiosError, null] as const;
  }
};
