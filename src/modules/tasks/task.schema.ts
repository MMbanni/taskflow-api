import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import type { Task } from "../../types/task.js";

const tasksSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-process', 'complete'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

export type TaskDoc = HydratedDocument<Task>;

export const TaskModel = mongoose.model<TaskDoc>('Task', tasksSchema);


