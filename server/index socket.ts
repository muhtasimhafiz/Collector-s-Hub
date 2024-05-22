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

    let highestBid = { amount: 0, user: '' };

    io.on('connection', (socket) => {
        console.log('a user connected');

        // Send the current highest bid to the newly connected user
        socket.emit('highestBid', highestBid);

        socket.on('newBid', (bid) => {
            console.log('new bid received:', bid);

            if (bid.amount > highestBid.amount) {
                highestBid = bid;
                io.emit('highestBid', highestBid);
            } else {
                socket.emit('bidRejected', { reason: 'Bid amount is too low' });
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit process if database connection fails
});
