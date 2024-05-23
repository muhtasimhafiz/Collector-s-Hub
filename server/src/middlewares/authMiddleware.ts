import { Socket } from 'socket.io';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403); // token is no longer valid
    (req as any).user = user; // Add type assertion to access 'user' property
    next();
  });
};



export const authenticateSocket = (socket: Socket, next: (err?: any) => void) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.data.user = decoded; // Attach the decoded user to socket data
    next();
  });
};
