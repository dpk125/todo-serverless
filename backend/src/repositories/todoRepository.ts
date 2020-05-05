import * as AWS from 'aws-sdk';
import * as xRay from 'aws-xray-sdk';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

const xAWS = xRay.captureAWS(AWS);

export class TodoRepository {
    constructor(
        private readonly documentClient = new xAWS.DynamoDB.DocumentClient(),
        private readonly todosTable: string = process.env.TODOS_TABLE
    ) {
    }

    async getByUserId(userId: string): Promise<TodoItem[]> {
        const result = await this.documentClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
            ScanIndexForward: false,
        }).promise();

        return result.Items as TodoItem[];
    }

    async save(item: TodoItem) {
        await this.documentClient.put({
            TableName: this.todosTable,
            Item: item
        }).promise();

        return item;
    }

    async update(todoId: string, item: TodoUpdate) {
        await this.documentClient.update({
            TableName: this.todosTable,
            UpdateExpression: 'SET name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': item.name,
                ':dueDate': item.dueDate,
                ':done': item.done
            },
            Key: { todoId }
        }).promise();
    }
}
