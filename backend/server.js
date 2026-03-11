const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/transactions', require('./routes/transactions'));
app.use('/api/v1/categories', require('./routes/categories'));

// Database connection & Server start
const PORT = process.env.PORT || 5000;

sequelize.sync()
    .then(() => {
        console.log('PostgreSQL connected and models synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
        // Still listen even if DB fail to allow the backend to respond with error messages
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} (Database disconnected)`);
        });
    });
