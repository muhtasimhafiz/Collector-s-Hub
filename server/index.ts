import express from 'express';
import { Application } from 'express';
import { initializeDatabase } from './config/database';
import userRoutes from './src/modules/Users/routes/userRoutes';  // Adjust path as needed
import { config } from 'dotenv';
import path from 'path';

import {
    ClerkExpressWithAuth,
    LooseAuthProp,
    WithAuthProp,
} from '@clerk/clerk-sdk-node';

// import { clerkClient } from '@clerk/clerk-sdk-node';
// import { sessions } from '@clerk/clerk-sdk-node';



config({
    path: path.resolve(__dirname, '.env')
});


const app: Application = express();
const port = process.env.PORT || 4200;



app.use(express.json());
// app.use(ClerkExpressWithAuth())
// Initialize database connection
initializeDatabase().then(() => {
    app.get('/', (req, res) => {
        res.send('Hello tomorrosw!');
    });
    app.use('/api', userRoutes);

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit process if database connection fails
});


// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
