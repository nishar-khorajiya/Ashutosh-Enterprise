import JWT from 'jsonwebtoken';
import {userModel} from '../models/userModel.js';

//protected Routes
export const requireSignIn = async (req, res, next) => {
    // try {
    //     const token = req.headers.Authorization.replace("Bearer ", "");
    //     const decode = JWT.verify(token, process.env.JWT_SECRET);

    //     req.user = decode;
    //     next();
    // } catch (error) {
    //     console.log("JWT required");
    // }
  const token = req.headers['authorization'];
  // console.log(token)
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = JWT.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};


//admin access
export const isAdmin = async (req, res, next) => {
  const user1 = JSON.parse(req.headers['login-user']);
    try {
        const user = await userModel.findById(user1._id)
        // console.log(user)
        if (user.role != 1) {
            return res.status(401).json({
                success: false,
                message: 'UnAuthorized Access',
                user
            })
        } 
        else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            error,
            message: "Error in admin middleware",
        })
    }
}