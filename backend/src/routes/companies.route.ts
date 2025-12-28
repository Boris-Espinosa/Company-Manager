import { Router } from "express";
import { CompaniesController } from "../controllers/companies.controller.ts";
import { CompaniesService } from "../services/companies.service.ts";

const router = Router();
const service = new CompaniesService();
const controller = new CompaniesController(service);

export default router;
