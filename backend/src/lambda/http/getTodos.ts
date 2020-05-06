import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as todoService from '../../services/todoService';
import { getUserId } from "../utils";
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const items = await todoService.getTodos(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({ items })
  }
});

handler.use(
  cors({ credentials: true })
);
