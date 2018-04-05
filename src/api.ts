import axios, { AxiosPromise } from 'axios';
import config from './config';

axios.defaults.headers.common.Authorization = config.piikki.token;
axios.defaults.baseURL = `${config.piikki.domain}/api/v1/global`;

async function getResult<T>(req: AxiosPromise<ApiResponse<T>>) { return (await req).data.result; }

export const getUser = async (username: string) =>
  getResult<User>(axios.get(`/users/${username}`));

export const authenticateUser = async (username: string, password: string) =>
  getResult<UserAuth>(axios.post('/authenticate', { username, password }));
