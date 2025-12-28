import { TasksService } from "../services/tasks.service.ts";

export class TasksController {
  constructor(private tasksService: TasksService) {}
}
