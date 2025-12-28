import { CompaniesService } from "../services/companies.service.ts";

export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}
}
