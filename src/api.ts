import axios, { AxiosPromise } from 'axios';
import _ from 'lodash';

import config from './config';

axios.defaults.headers.common.Authorization = config.piikki.token;
axios.defaults.baseURL = `${config.piikki.domain}/api/v1/global`;

async function getResult<T>(req: AxiosPromise<ApiResponse<T>>) {
  return (await req).data.result;
}

export const getUser = async (username: string) =>
  getResult<User>(axios.get(`/users/${username}`));

export const createUser = async (username: string, password: string) =>
  getResult<any>(axios.post('/users/create', { username, password }));

export const authenticateUser = async (username: string, password: string) =>
  getResult<UserAuth>(
    axios.post('/users/authenticate', { username, password }),
  );

export const getUserById = async (id: number) =>
  getResult<AlternativeUserAuth>(
    axios.post('/users/authenticate/alternative', {
      key: _.toString(id),
      type: 30,
    }),
  );

export const saveIdForUser = async (username: string, id: number) =>
  getResult<AlternativeUserAuth>(
    axios.post('/users/authenticate/alternative/create', {
      username,
      key: _.toString(id),
      type: 30,
    }),
  );

export const makeTransaction = async (
  username: string,
  groupName: string,
  amount: number,
  comment?: string,
) =>
  getResult<Transaction>(
    axios.post('/transaction', { username, groupName, amount }),
  );

export const setDefaultGroup = async (username: string, groupName: string) =>
  getResult<any>(axios.post(`/users/${username}/defaultGroup`, { groupName }));

export const getGroups = async () =>
  getResult<any>(axios.get('/groups', { params: { all: true } }));

export const joinGroup = async (username: string, groupName: string) =>
  getResult<any>(axios.post(`/groups/${groupName}/addMember`, { username }));

export const joinPrivateGroup = async (
  username: string,
  password: string,
  groupName: string,
) =>
  getResult<any>(
    axios.post(`/groups/${groupName}/addMember`, { username, password }),
  );

export const partGroup = async (username: string, groupName: string) =>
  getResult<any>(
    axios.delete(`/groups/${groupName}/removeMember`, { data: { username } }),
  );
