import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { connectDb } from './config/connectDb.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js'
import notesRoutes from './routes/notes.routes.js'


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser())
// Routes
app.get('/healthcheck', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running...'
    })
})
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/notes',notesRoutes);

const startServer = async () =>{
    try {
        connectDb();
        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();