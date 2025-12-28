import { UsersService } from "../services/users.service.ts";

export class UsersController {
  constructor(private usersService: UsersService) {}
}
