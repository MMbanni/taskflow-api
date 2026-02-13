import { body, query } from 'express-validator';
import type { Priority, Status } from '../../types/task.js';

const TITLE_MAX = 150;
const DESCRIPTION_MAX = 500;
const LIMIT_MAX = 500;
const STATUS_VALUES: Status[] = ['todo', 'in-process', 'complete'];
const PRIORITY_VALUES: Priority[] = ['low', 'medium', 'high'];


export const createTaskValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim()
    .isLength({ min: 1, max: TITLE_MAX })
    .withMessage(`Title must be 1-${TITLE_MAX} characters`),

  body('status')
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage('Priority must be low, medium, or high'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: DESCRIPTION_MAX })
    .withMessage(`Description cannot be more than ${DESCRIPTION_MAX} characters`)
];

export const queryTaskValidator = [

  query('status')
    .optional()
    .isIn(STATUS_VALUES)    
    .withMessage('Invalid status')
    .customSanitizer(v => v as Status),

  query('priority')
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage('Invalid priority')
    .customSanitizer(v => v as Priority),    

  query('page')
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Page must be >= 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: LIMIT_MAX })
    .toInt()
    .withMessage(`Limit must be 1–${LIMIT_MAX}`),

  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
];

export const updateTaskValidator = [

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: TITLE_MAX })
    .withMessage(`Title must be 1-${TITLE_MAX} characters`),

  body('description')
    .optional()
    .trim()
    .isLength({ max: DESCRIPTION_MAX })
    .withMessage(`Description cannot be more than ${DESCRIPTION_MAX} characters`),

  body('status')
    .optional()
    .isIn(STATUS_VALUES)    
    .withMessage('Invalid status')
    .customSanitizer(v => v as Status),

  body('priority')
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage('Invalid priority')
    .customSanitizer(v => v as Priority),
];


