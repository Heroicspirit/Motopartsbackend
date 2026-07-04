import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const productController = new ProductController();
const router = Router();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);

// Protected routes (admin only)
router.post("/", authenticate, authorize('admin'), productController.createProduct);
router.put("/:id", authenticate, authorize('admin'), productController.updateProduct);
router.delete("/:id", authenticate, authorize('admin'), productController.deleteProduct);

export default router;
