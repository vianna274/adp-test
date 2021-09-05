import * as http from 'http';
import { fetchTask, postSubmitTask } from './api';
import { FetchTaskResponse, SubmitTaskBody } from './api/models';
import { executeMathOperation, MATH_OPERATORS } from './utils/math';
import { AxiosResponse, AxiosError } from 'axios';
import { handleAxiosError } from './utils/request';
import WebSocket from 'ws';
import 'dotenv/config';
import { createWSPayload } from './utils/websocket';

const enhancedFetchTask = async (): Promise<[AxiosResponse<FetchTaskResponse>, null] | [null, AxiosError]> => {
  try {
    const response = await fetchTask();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const enhancedPostSubmitTask = async (
  body: SubmitTaskBody,
): Promise<[AxiosResponse<any>, null] | [null, AxiosError]> => {
  try {
    const response = await postSubmitTask(body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

let lastExecutedTask: any;

const executeTask = async () => {
  try {
    const [fetchTaskRes, fetchTaskError] = await enhancedFetchTask();

    if (fetchTaskError) {
      console.error('Error at fetching task', fetchTaskError);
      return;
    }

    const { right, left, operation, id } = fetchTaskRes!.data;

    const valueCalculated = executeMathOperation({ right, left, operation });

    const [submitTaskRes, submitTaskError] = await enhancedPostSubmitTask({ id, result: valueCalculated });

    if (submitTaskError) {
      handleAxiosError(submitTaskError);
      return;
    }

    console.log(`${left} ${MATH_OPERATORS[operation]} ${right} = ${valueCalculated} -- Status: ${submitTaskRes!.data}`);

    lastExecutedTask = {
      right,
      left,
      operation,
      valueCalculated,
    };
  } catch (error) {
    console.error('Unhandled error', error);
  } finally {
    setTimeout(executeTask, 1000);
  }
};

executeTask();

const server = http.createServer((req, res) => {});

const serverListening = server.listen(process.env.PORT);

const wss = new WebSocket.Server({
  server: serverListening,
});

function onError(ws: any, err: any) {
  console.error(`onError: ${err.message}`);
}

function onMessage(ws: any, data: any) {
  console.log(`onMessage: ${data}`);
  ws.send(`recebido!`);
}

function onConnection(ws: any, req: any) {
  ws.on('message', (data: any) => onMessage(ws, data));
  ws.on('error', (error: any) => onError(ws, error));
  console.log(`onConnection`);
}

wss.on('connection', (ws) => {
  const payload = createWSPayload({ type: 'executed-task', data: lastExecutedTask });
  ws.send(payload);
});
