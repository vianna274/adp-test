import { HttpClient } from '../utils/request';
import { FetchTaskResponse, SubmitTaskBody } from './models';

export const fetchTask = () => HttpClient.get<FetchTaskResponse>('/get-task');

export const postSubmitTask = (body: SubmitTaskBody) => HttpClient.post('/submit-task', body);
