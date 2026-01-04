const {
  createTask,
  deleteTask,
  updateTask,
  listTasks,
  getTaskById,
  incrementPriority
} = require('../models/tasks.model');

const asyncHandler = require('../utils/asyncHandler');

// Create task
const httpCreateTask = asyncHandler(async (req, res) => {

  const { id: userId } = req.user;
  const { title, description, status, priority } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      errors: ['Bad request']
    });
  }

  const task = { userId, title, description, status, priority };

  const createdTask = await createTask(task);
  if (!createdTask) {
    return res.status(500).json({
      success: false,
      errors: ['Error creating task']
    });
  }
  return res.status(201).json({
    success: true,
    data: createdTask
  });
})

// Get user tasks
const httpGetTasks = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const queries = req.query;
  const tasks = await listTasks(userId, queries);

  return res.status(200).json({
    success: true,
    data: tasks
  });
})

const httpGetTaskById = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const taskId = req.params.taskId;
  const task = await getTaskById({ userId, taskId });
  // 404
  if (!task) {
    return res.status(404).json({
      success: false,
      errors: ["No task matches ID"]
    });
  }

  return res.status(200).json({
    success: true,
    data: task
  });
})


const httpUpdateTask = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const taskId = req.params.taskId;

  if (!taskId) return res.status(400).json({
    success: false,
    errors: ['Bad request']
  });

  const input = req.body;
  // Validate input length
  if (!Object.keys(input).length) {
  return res.status(400).json({
    success: false,
    errors: ['No changes to make']
  });
}

  const updatedTask = await updateTask(userId, taskId, input);

  if (!updatedTask) {
    return res.status(404).json({
      success: false,
      errors: ['Task not found']
    });
  }

  return res.status(200).json({
    success: true,
    data: updatedTask
  });

})


const httpDeleteTask = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;


  const taskId = req.params.taskId;

  if (!taskId) {
    return res.status(400).json({
      success: false,
      errors: ['Bad request']
    });
  }

  const deletedTask = await deleteTask(userId, taskId);
  if (!deletedTask) {
    return res.status(404).json({
      success: false,
      errors: ['No task deleted']
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Task deleted'
  });

})

const httpIncrementPriority = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const taskId = req.params.taskId;
  if (!taskId) {
    return res.status(400).json({
      success: false,
      errors: ['Bad request']
    });
  }

  const task = await incrementPriority(userId, taskId);
  return res.status(200).json({
    success: true,
    data: task
  });

})

const httpDecrementPriority = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const taskId = req.params.taskId;
  if (!taskId) {
    return res.status(400).json({
      success: false,
      errors: ['Bad request']
    });
  }

  const task = await decrementPriority(userId, taskId);
  return res.status(200).json({
    success: true,
    data: task
  });

})

module.exports = { 
  httpCreateTask,
  httpDeleteTask,
  httpGetTasks,
  httpGetTaskById,
  httpUpdateTask,
  httpIncrementPriority,
  httpDecrementPriority
};