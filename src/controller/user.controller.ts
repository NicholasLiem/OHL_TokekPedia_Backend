import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import config from 'config';
import jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';

const secretKey = config.get('tokenSecretKey'); // Replace with your own secret key

export const register = async (req: Request, res: Response, db: DataSource) => {
    const { username, password, name } = req.body;
    try {
        if (username == null || password == null || name == null) {
            return res.status(500).json({
                status: 'error',
                message: 'Error registering user',
                data: {
                    username: username,
                    password: password,
                    name: name
                }
            })
        }

        const userEntity = await db.manager.findOne(UserModel, { where: { username: username } });
        if (userEntity) {
            return res.status(500).json({
                status: 'error',
                message: 'Username already exist',
                data: {
                    username: username,
                    password: password,
                    name: name
                }
            })
        }

        const user = new UserModel(username, password, name)
        await db.manager.save(user)

        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                username: username,
                password: password,
                name: name
            }
        })
    } catch (error) {
        console.error('Failed to register user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register user',
            data: {
                username: username,
                password: password,
                name: name
            }
        })
    }
}

export const login = async (req: Request, res: Response, db: DataSource) => {
  const { username, password } = req.body;

  try {
    const user = await db.manager.findOne(UserModel, { where: { username: username } });

    if (!user || user.password !== password) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
        data: null
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, secretKey);
    res.cookie('token', token, { httpOnly: true });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          username: user.username,
          name: user.name
        },
        token: token
      }
    });
  } catch (error) {
    console.error('Failed to login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to login',
      data: null
    })
  }
}

// export const self = (req: Request, res: Response, db: DataSource) => {
//   // Extract the user ID from the authenticated token
//   const userId = req.user.userId;

//   try {
//     // Retrieve user information from the database
//     const user = userRepository.findOne(userId);

//     if (!user) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'User not found',
//         data: null
//       });
//     }

//     res.status(200).json({
//       status: 'success',
//       message: 'User details retrieved successfully',
//       data: {
//         username: user.username,
//         name: user.name
//       }
//     });
//   } catch (error) {
//     console.error('Failed to retrieve user details:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to retrieve user details',
//       data: null
//     });
//   }
// };
