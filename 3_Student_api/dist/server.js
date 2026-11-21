import express from 'express';
import 'dotenv/config';
import { pool } from './controllers/routes/db.js';
import studentRoutes from './controllers/routes/studentRoutes.js';
// Test database connection on startup
pool.query('SELECT NOW()')
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
    console.error('Database connection failed. Check .env, Supabase, and your network.');
    console.error('Error details:', err.message || err);
});
const app = express();
const port = process.env.PORT || 4000;
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use(express.json());
app.use('/students', studentRoutes);
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Student Information API',
        course: 'ITE 303',
    });
});
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
