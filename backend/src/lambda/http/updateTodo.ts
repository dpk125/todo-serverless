import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as todoService from '../../services/todoService';
import { getUserId } from '../utils';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  await todoService.update(todoId, userId, updatedTodo);

  return {
    statusCode: 200,
    body: ''
  }
});

handler.use(
  cors({ credentials: true })
);
