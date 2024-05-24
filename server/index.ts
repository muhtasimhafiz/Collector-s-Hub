import express from 'express';
import { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeDatabase } from './config/database';
import userRoutes from './src/modules/Users/routes/userRoutes';  // Adjust path as needed
import productRoutes from './src/modules/Products/routes/productRoutes';  // Adjust path as needed
import productCategoryRoutes from './src/modules/Products/routes/productCategoryRoutes';  // Adjust path as needed
import liveStreamRoutes from './src/modules/Livestreams/livestreamRoutes';  // Adjust path as needed
import ProductBidRoutes from './src/modules/ProductBid/productBidRoutes';  // Adjust path as needed
import {socketHandler} from './src/modules/sockets/index';
import { authenticateSocket } from './src/middlewares/authMiddleware';
import VideoRoutes from './src/modules/videos/videoRoutes';  

import { config } from 'dotenv';
import path from 'path';
import {
    ClerkExpressWithAuth,
    LooseAuthProp,
    WithAuthProp,
} from '@clerk/clerk-sdk-node';
import { authenticateToken } from './src/middlewares/authMiddleware';

config({
    path: path.resolve(__dirname, '.env')
});

const cors = require('cors');

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});
// io.use(authenticateSocket);

app.use(cors());
const port = process.env.PORT || 4200;

app.use(express.json());

initializeDatabase().then(() => {
    app.get('/', (req, res) => {
        res.send('Hello tomorrosw!');
    });

    app.use('/api', userRoutes);
    app.use('/api', productRoutes);
    app.use('/api', productCategoryRoutes);
    app.use('/api', liveStreamRoutes);
    app.use('/api', ProductBidRoutes);
    app.use('/api', VideoRoutes);

    let highestBid = { amount: 0, user: '' };

    socketHandler(io); // Use the socket handler

    server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit process if database connection fails
});
