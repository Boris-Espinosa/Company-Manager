import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { UsersService } from "../services/users.service.ts";

const router = Router();
const service = new UsersService();
const controller = new UsersController(service);
router.get("", controller.getAll);
router.get("/:id", controller.getOne);
router.post("", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
