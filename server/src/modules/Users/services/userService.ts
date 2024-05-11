import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Function to generate JWT
const generateToken = (user: { id: number; username: string; email: string }) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );
};

// Add this method to your existing user service or use it in user login/registration functions
export const loginUser = async (username: string, password: string) => {
    const user = await User.findOne({ where: { username } });
    if (user && bcrypt.compareSync(password, user.password)) {
        // Passwords match
        const token = generateToken(user);
        return { user, token };
    } else {
        // Authentication failed
        throw new Error('Authentication failed.');
    }
};


const saltRounds = 10; // The cost factor for hashing passwords.

// Create a new user
export const createUser = async (userData: { username: string; email: string; password: string }): Promise<User> => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Get a single user by ID
export const getUserById = async (id: number): Promise<User | null> => {
    try {
        const user = await User.findByPk(id);
        return user;
    } catch (error) {
        console.error('Error retrieving user:', error);
        throw error;
    }
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
};

// Update a user
export const updateUser = async (id: number, updates: { username?: string; email?: string; password?: string }): Promise<User | null> => {
    try {
        const user = await User.findByPk(id);
        if (user) {
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, saltRounds);
            }
            await user.update(updates);
        }
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete a user
export const deleteUser = async (id: number): Promise<void> => {
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};


export const findUserByEmailOrUsername = async (email: string, username: string): Promise<User | null> => {
    try {
        const user = await User.findOne({ where: { email, username } });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
};
