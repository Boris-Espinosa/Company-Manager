import { Request, Response } from "express";
import { CompaniesService } from "../services/companies.service.ts";

export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  create = async (req: Request, res: Response) => {};

  getAll = async (req: Request, res: Response) => {};

  getOne = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};
}
