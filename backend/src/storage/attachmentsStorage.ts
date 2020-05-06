import * as AWS from 'aws-sdk';
import * as xRay from 'aws-xray-sdk';

const xAWS = xRay.captureAWS(AWS);

const attachmentsBucketName = process.env.ATTACHMENTS_S3_BUCKET;
const signedUrlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

const s3 = new xAWS.S3({
  signatureVersion: 'v4'
});

export function getAttachmentUrl(todoId: string): string {
  return `https://${attachmentsBucketName}.s3.amazonaws.com/${todoId}`;
}

export function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: attachmentsBucketName,
    Key: todoId,
    Expires: signedUrlExpiration
  });
}
