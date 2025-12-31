import { TasksService } from "../services/tasks.service.ts";

export class TasksController {
  constructor(private tasksService: TasksService) {}

  create = async (req: Request, res: Response) => {};

  getAll = async (req: Request, res: Response) => {};

  getOne = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};
}
