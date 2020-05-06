import * as uuid from 'uuid';
import { TodoItem } from '../models/TodoItem';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { TodoRepository } from '../repositories/todoRepository';
import * as attachmentsStorage from '../storage/attachmentsStorage';
import { TodoUpdateAttachment } from '../models/TodoUpdateAttachment';

const todoRepository = new TodoRepository();

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todoRepository.getByUserId(userId);
}

export async function create(userId: string, request: CreateTodoRequest) {
    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();

    const item = {
        ...request,
        todoId,
        userId,
        createdAt,
        done: false
    };

    return await todoRepository.save(item);
}

export async function remove(todoId: string, userId: string) {
    await todoRepository.remove(todoId, userId);
}

export async function update(todoId: string, userId: string, request: UpdateTodoRequest) {
    await todoRepository.update(todoId, userId, request);
}

export function getAttachmentUploadUrl(todoId: string, userId: string) {
  return attachmentsStorage.getUploadUrl(todoId, userId);
}

export function getAttachmentUrl(todoId: string) {
  return attachmentsStorage.getAttachmentUrl(todoId);
}

export async function updateAttachment(todoId: string, request: TodoUpdateAttachment) {
  const userId = await attachmentsStorage.getAttachmentUser(todoId);
  await todoRepository.updateAttachment(todoId, userId, request);
}
