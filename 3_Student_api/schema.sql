-- Schema for ITE 303 Student API
DROP TABLE IF EXISTS students;

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  year_level INTEGER NOT NULL CHECK (year_level BETWEEN 1 AND 4)
);

-- Seed initial records for testing
INSERT INTO students (student_number, first_name, last_name, course, year_level) VALUES
  ('2024-0001', 'Juan', 'Dela Cruz', 'BSIT', 3),
  ('2024-0002', 'Maria', 'Santos', 'BSCS', 2),
  ('2024-0003', 'Pedro', 'Penduko', 'BSIS', 1);
