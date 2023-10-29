import {userModel} from '../models/userModel.js';
import { hashpassword, comparePassword } from '../helpers/authHelpers.js';
import JWT from 'jsonwebtoken';
import orderModel from '../models/orderModel.js';

export const registerController = async (req, res) => {
    try {

        const { name, email, password, phone ,cpassword,address} = req.body;
        // const {  email, password } = req.body;

        //is any field blank
        if (!name) { return res.status(400).json({ success: false,message: 'name is required' }) }
        if (!email) { return res.status(400).json({ success: false,message: 'email is required' }) }
        if (!password) { return res.status(400).json({ success: false,message: 'password is required' }) }
        if (!cpassword) { return res.status(400).json({ success: false,message: 'confirm password is required' }) }
        if (!phone) { return res.status(400).json({ success: false,message: 'phone number is required' }) }
        if (!address) { return res.status(400).json({ success: false,message: 'address is required' }) }
        // if (!address) { return res.send({ error: 'Address is required' }) }

        if (password !== cpassword) {
            return res.status(400).json({success: false, message: 'Passwords do not match' });
          }
        
        //user is aleready exists
        const exisitingUser = await userModel.findOne({ email: email })
        if (exisitingUser) {
            return res.status(200).json({
                success: false,
                message: 'Already Register please login'
            })
        }

        //register user
        const hashedPassword = await hashpassword(password);

        //save
        const user = await new userModel({ name, email, phone,address, password: hashedPassword }).save();

        return res.status(201).json({
            success: true,
            message: 'User Register successfully',
            user
        })

    } catch (error) {
        console.log(error);
       return res.status(500).json({
            success: false,
            message: 'error in registration',
            error
        })
    }
}

//login controller

export const loginController = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: ' email and  password is required',
            })
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email is not registered'
            })
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Invalid password'
            })
        }

        const token = await JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            
            success: true,
            message: 'login Successfully',
            user: {
                _id:user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role:user.role,
            },
            token,
        }
        )

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'error in login',
            error
        })
    }
}

//get all user
export const GetAllUserController = async(req, res) => {
   try{
        const allusers =await userModel.find({});
        if(allusers){
            res.status(200).send({
                message:"get all users successfully",
                allusers
            })
        }
        else{
            res.status(500).send({
                message:"any user not found"
            })
        }
   }catch(error){
    console.log(error)
    res.status(500).send(error+"error in geting all user")
   }
}

//update prfole
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, phone ,address} = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        { email:email || user.email,
          name: name || user.name,
          address: address || user.address,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };

  
//orders
export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

//orders
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  
  //order status
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };
  
// //test controller
// export const testController = (req, res) => {
//     res.send('route protected')
// }

// module.exports = { registerController, loginController, testController };