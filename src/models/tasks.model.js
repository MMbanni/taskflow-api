const Task = require('./tasks.mongo');

async function createTask(data) {

  const task = await Task.create(data);
  return task;
}

async function listTasks(userId, filters = {}) {

  filters.userId = userId;

  return await Task.find(filters)
    .populate('userId', 'username email');
}

async function getTaskById(userId, taskId) {

  return await Task.find(userId, taskId)
    .populate('userId', 'username email');
}


async function updateTask(userId, taskId, task) {

  const updates = {};

  if (task.title) updates.title = task.title;
  if (task.description) updates.description = task.description;
  if (task.status) updates.status = task.status;
  if (task.priority) updates.priority = task.priority;

  const updatedTask = await Task.findOneAndUpdate(
    { userId, taskId },
    { $set: updates },
    { new: true }
  );

  return updatedTask;
}

async function deleteTask(userId, taskId) {
  const task = {
    _id: taskId,
    userId
  };

  return await Task.findOneAndDelete(task);
}

async function incrementPriority(taskId) {

  const task = await Task.findOne({ taskId });

  const priorityOrder = ['low', 'medium', 'high'];
  const currentPriority = priorityOrder.indexOf(task.priority);
  const nextPriority = priorityOrder[Math.min(currentPriority + 1, priorityOrder.length - 1)];

  const updatedTask = await Task.findOneAndUpdate(
    { taskId },
    { $set: { "priority": nextPriority } },
    { "new": true }
  );

  return updatedTask;

}

async function decrementPriority(taskId) {

  const task = await Task.findOne({ taskId });

  const priorityOrder = ['low', 'medium', 'high'];
  const currentPriority = priorityOrder.indexOf(task.priority);
  const prevPriority = priorityOrder[Math.max(currentPriority - 1, 0)];

  const updatedTask = await Task.findOneAndUpdate(
    { taskId },
    { $set: { "priority": prevPriority } },
    { "new": true }
  );

  return updatedTask;

}

module.exports = {
  createTask,
  listTasks,
  deleteTask,
  updateTask,
  getTaskById,
  incrementPriority,
  decrementPriority
}