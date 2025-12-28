import { Router } from "express";
import { TasksController } from "../controllers/tasks.controller.js";
import { TasksService } from "../services/tasks.service.ts";

const router = Router();
const service = new TasksService();
const controller = new TasksController(service);

export default router;
