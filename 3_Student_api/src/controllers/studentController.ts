import type { Request, Response } from 'express';
import { pool } from './routes/db.js';

export async function getStudents(_req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(
      'SELECT * FROM students ORDER BY id;'
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Could not load students' });
  }
}

export async function getStudentById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ message: 'Student ID must be a positive integer' });
    return;
  }
 
  try {
    const result = await pool.query(
      'SELECT * FROM students WHERE id = $1;',
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Could not load student' });
  }
 
}

export async function createStudent(req: Request, res: Response): Promise<void> {
  // Get the data sent by Postman
  const body = req.body;
 
  // Make sure the data is a JSON object
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    res.status(400).json({ message: 'A JSON object is required' });
    return;
  }
 
  const { student_number, first_name, last_name, course, year_level } = body;
 
  // Check the required text fields
  if (typeof student_number !== 'string' || student_number.trim() === '' ||
      typeof first_name !== 'string' || first_name.trim() === '' ||
      typeof last_name !== 'string' || last_name.trim() === '' ||
      typeof course !== 'string' || course.trim() === '') {
    res.status(400).json({ message: 'All text fields are required' });
    return;
  }
 
  // Check that the year level is a positive whole number
  if (typeof year_level !== 'number' || !Number.isInteger(year_level) ||
      (year_level < 1 || year_level > 4)) {
    res.status(400).json({ message: 'year_level must be a positive whole number and a real year level' });
    return;
  }
 
  // Match each SQL place ($1 to $5) with one value below
  const sql = `INSERT INTO students
    (student_number, first_name, last_name, course, year_level)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, student_number, first_name, last_name, course, year_level;`;
  const values = [
    student_number.trim(), first_name.trim(), last_name.trim(),
    course.trim(), year_level
  ];
 
  try {
    // Save the student to PostgreSQL
    const result = await pool.query(sql, values);
 
    // Send the saved student back to Postman
    res.status(201).json(result.rows[0]);
  } catch (error: unknown) {
    // Tell Postman if the student number is already used
    if (typeof error === 'object' && error !== null &&
        'code' in error && error.code === '23505') {
      res.status(409).json({ message: 'student_number already exists' });
      return;
    }
 
    // Send a safe message for other database errors
    res.status(500).json({ message: 'Could not create student' });
  }
}



export async function updateStudent(req: Request, res: Response): Promise<void> {
  // 1. Validate route parameter :id
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ message: 'Student ID must be a positive integer' });
    return;
  }

  // 2. Validate request body
  const body = req.body;
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    res.status(400).json({ message: 'A JSON object is required' });
    return;
  }

  const { student_number, first_name, last_name, course, year_level } = body;

  // 3. Validate text fields
  if (
    typeof student_number !== 'string' || student_number.trim() === '' ||
    typeof first_name !== 'string' || first_name.trim() === '' ||
    typeof last_name !== 'string' || last_name.trim() === '' ||
    typeof course !== 'string' || course.trim() === ''
  ) {
    res.status(400).json({ message: 'All text fields are required' });
    return;
  }

  // 4. Validate year_level
  if (
    typeof year_level !== 'number' ||
    !Number.isInteger(year_level) ||
    year_level < 1 ||
    year_level > 4
  ) {
    res.status(400).json({
      message: 'year_level must be a positive whole number and a real year level',
    });
    return;
  }

  // 5. Parameterized SQL UPDATE query
  const sql = `
    UPDATE students
    SET student_number = $1,
        first_name = $2,
        last_name = $3,
        course = $4,
        year_level = $5
    WHERE id = $6
    RETURNING id, student_number, first_name, last_name, course, year_level;
  `;

  const values = [
    student_number.trim(),
    first_name.trim(),
    last_name.trim(),
    course.trim(),
    year_level,
    id,
  ];

  try {
    const result = await pool.query(sql, values);

    // If no row was updated, the student ID doesn't exist
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    // 200 OK with the updated record
    res.status(200).json(result.rows[0]);
  } catch (error: unknown) {
    // Check for unique constraint violation (duplicate student_number)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    ) {
      res.status(409).json({ message: 'student_number already exists' });
      return;
    }

    res.status(500).json({ message: 'Could not update student' });
  }
}

export async function deleteStudent(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ message: 'Student ID must be a positive integer' });
    return;
  }

  try {
    const result = await pool.query(
      'DELETE FROM students WHERE id = $1 RETURNING id, student_number, first_name, last_name, course, year_level;',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    res.status(200).json({
      message: 'Student deleted successfully',
      student: result.rows[0],
    });
  } catch {
    res.status(500).json({ message: 'Could not delete student' });
  }
}