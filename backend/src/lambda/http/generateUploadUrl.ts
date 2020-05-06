import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAttachmentUploadUrl } from '../../services/todoService';
import { cors } from 'middy/middlewares';
import middy from 'middy';
import { getUserId } from '../utils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const uploadUrl = getAttachmentUploadUrl(todoId, userId);

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl })
  }
});


handler.use(
  cors({ credentials: true })
);
