import { AxiosResponse, AxiosError } from 'axios';
import { fetchTask, postSubmitTask } from '../api';
import { MathOperation, FetchTaskResponse, SubmitTaskBody } from '../api/models';

export type TaskSubject = {
  right: number;
  left: number;
  operation: MathOperation;
  valueCalculated: number;
};

export const enhancedFetchTask = async (): Promise<[AxiosResponse<FetchTaskResponse>, null] | [null, AxiosError]> => {
  try {
    const response = await fetchTask();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const enhancedPostSubmitTask = async (
  body: SubmitTaskBody,
): Promise<[AxiosResponse<any>, null] | [null, AxiosError]> => {
  try {
    const response = await postSubmitTask(body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
