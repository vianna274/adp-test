import 'dotenv/config';

import * as http from 'http';
import { Subject, tap } from 'rxjs';
import WebSocket from 'ws';

import { executeMathOperation, MATH_OPERATORS } from './utils/math';
import { handleAxiosError } from './utils/request';
import { unsubscribe } from './utils/subscription';
import { enhancedFetchTask, enhancedPostSubmitTask, TaskSubject } from './utils/task';
import { createWSPayload } from './utils/websocket';

const taskSubject = new Subject<TaskSubject>();

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

    taskSubject.next({
      right,
      left,
      operation,
      valueCalculated,
    });
  } catch (error) {
    console.error('Unhandled error', error);
  } finally {
    setTimeout(executeTask, 1000);
  }
};

executeTask();

const server = http.createServer().listen(process.env.PORT);

const wss = new WebSocket.Server({
  server,
});

wss.on('connection', (clientWS) => {
  const subscription = taskSubject
    .pipe(
      tap((task) => {
        const payload = createWSPayload({ type: 'executed-task', data: task });
        clientWS.send(payload);
      }),
    )
    .subscribe();

  clientWS.on('error', () => unsubscribe(subscription));
  clientWS.on('close', () => unsubscribe(subscription));
});
