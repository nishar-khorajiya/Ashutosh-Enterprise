import express from 'express';
import {
    registerController,
    loginController,
    GetAllUserController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController
} from '../controllers/authController.js';
import { contactusController } from '../controllers/contactusController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

//routing-resister || method POST
router.post('/register', registerController);

//LOGIN || POST
router.post('/login', loginController)

//CONTACT US || POST
router.post('/contactus', contactusController)

// //test routes
// router.get('/test', requireSignIn, isAdmin, testController);

//protected routes auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

//protected admin routes
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

//get all user
router.get("/all-user", requireSignIn, isAdmin, GetAllUserController)

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
