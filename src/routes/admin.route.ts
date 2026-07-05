import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const authController = new AuthController();
const router = Router();

// Admin user management routes
router.get("/users/", authenticate, authorize('admin'), authController.getAllUsers);
router.get("/users/:userId", authenticate, authorize('admin'), authController.getUserById);
router.put("/users/:userId", authenticate, authorize('admin'), authController.updateUser);
router.delete("/users/:userId", authenticate, authorize('admin'), authController.deleteUser);

export default router;
