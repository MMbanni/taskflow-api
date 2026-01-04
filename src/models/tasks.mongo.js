const mongoose = require('mongoose');
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
    enum: ['low', 'med', 'high'],
    default: 'med'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', tasksSchema);