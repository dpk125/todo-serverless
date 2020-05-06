import { S3Handler } from 'aws-lambda';
import 'source-map-support/register';

import * as todoService from '../../services/todoService';

export const handler: S3Handler = async (event) => {
  for (const record of event.Records) {
    const todoId = record.s3.object.key;
    const attachmentUrl = todoService.getAttachmentUrl(todoId);
    await todoService.updateAttachment(todoId, { attachmentUrl });
  }
}
