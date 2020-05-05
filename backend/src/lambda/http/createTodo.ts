import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import * as todoService from '../../services/todoService';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event);

  const item = await todoService.create(userId, newTodo);

  return {
    statusCode: 201,
    body: JSON.stringify({ item })
  }
});

handler.use(
  cors({ credentials: true })
);
