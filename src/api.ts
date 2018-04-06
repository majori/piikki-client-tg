import axios, { AxiosPromise } from 'axios';
import _ from 'lodash';

import config from './config';

axios.defaults.headers.common.Authorization = config.piikki.token;
axios.defaults.baseURL = `${config.piikki.domain}/api/v1/global`;

async function getResult<T>(req: AxiosPromise<ApiResponse<T>>) { return (await req).data.result; }

export const getUser = async (username: string) =>
  getResult<User>(axios.get(`/users/${username}`));

export const authenticateUser = async (username: string, password: string) =>
  getResult<UserAuth>(axios.post('/authenticate', { username, password }));

export const getUserById = async (id: string) =>
  getResult<AlternativeUserAuth>(axios.post('/users/authenticate/alternative', { key: _.toString(id), type: 30 }));

export const makeTransaction = async (username: string, groupName: string, amount: number, comment: string | null) =>
  getResult<Transaction>(axios.post('/transaction', { username, groupName, amount }));
