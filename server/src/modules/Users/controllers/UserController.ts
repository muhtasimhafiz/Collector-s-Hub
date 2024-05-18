import { Request, Response } from 'express';
import { createUser, findUserByEmailOrUsername, getUserById, loginUser, updateUser } from '../services/userService';
import { validationResult } from 'express-validator';

/**
 * HTTP POST handler for creating a new user.
 */
export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('createUserHandler');
  console.log(req.body)
  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    };

    console.log('userData', userData);

    const user = await createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to create user", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to create user", error: "Unknown error" });
    }
  }
};


export const loginUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
}

export const registrationHandle = async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    };

    const existingUser = await findUserByEmailOrUsername(userData.email, userData.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }
    
    const user = await createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to create user", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to create user", error: "Unknown error" });
    }
  }
}


export const getuserDetails = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(Number(req.params.id));
    res.status(200).json(user);
  } catch (error:any) {
    res.status(500).json({ message: "Failed to get user details", error: error.message });
  }
}

export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const user = await updateUser(Number(req.params.id), req.body);
    res.status(200).json(user);
  } catch (error:any) {
    res.status(500).json({ message: "Failed to get user details", error: error.message });
  }
}