import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../studentController.js';

const router = Router();

// GET /students - list all students
router.get('/', getStudents);

// GET /students/:id - get student by ID
router.get('/:id', getStudentById);

// POST /students - create new student
router.post('/', createStudent);

// PUT /students/:id - update existing student
router.put('/:id', updateStudent);

// DELETE /students/:id - delete student by ID
router.delete('/:id', deleteStudent);

export default router;