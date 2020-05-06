import * as AWS from 'aws-sdk';
import * as xRay from 'aws-xray-sdk';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';
import { TodoUpdateAttachment } from '../models/TodoUpdateAttachment';

const xAWS = xRay.captureAWS(AWS);

export class TodoRepository {
  constructor(
    private readonly documentClient = new xAWS.DynamoDB.DocumentClient(),
    private readonly todosTable: string = process.env.TODOS_TABLE,
    private readonly todosIndex: string = process.env.TODOS_INDEX
  ) {
  }

  async getByUserId(userId: string): Promise<TodoItem[]> {
    const result = await this.documentClient.query({
      TableName: this.todosTable,
      IndexName: this.todosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: true,
    }).promise();

    return result.Items as TodoItem[];
  }

  async save(item: TodoItem) {
    await this.documentClient.put({
      TableName: this.todosTable,
      Item: item,
    }).promise();

    return item;
  }

  async remove(todoId: string, userId: string) {
    await this.documentClient.delete({
      TableName: this.todosTable,
      Key: { todoId, userId },
    }).promise();
  }

  async update(todoId: string, userId: string, item: TodoUpdate) {
    await this.documentClient.update({
      TableName: this.todosTable,
      UpdateExpression: 'SET #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': item.name,
        ':dueDate': item.dueDate,
        ':done': item.done,
      },
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      Key: { todoId, userId },
    }).promise();
  }

  async updateAttachment(todoId: string, userId: string, item: TodoUpdateAttachment) {
    await this.documentClient.update({
      TableName: this.todosTable,
      UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': item.attachmentUrl
      },
      Key: { todoId, userId },
    }).promise();
  }
}
