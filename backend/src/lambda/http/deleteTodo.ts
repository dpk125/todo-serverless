import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import * as todoService from '../../services/todoService';
import { getUserId } from '../utils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);

  await todoService.remove(todoId, userId);

  return {
      statusCode: 200,
      body: ''
  }
});

handler.use(
  cors({ credentials: true })
);
