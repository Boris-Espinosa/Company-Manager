import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { UsersService } from "../services/users.service.ts";

const router = Router();
const service = new UsersService();
const controller = new UsersController(service);

export default router;
