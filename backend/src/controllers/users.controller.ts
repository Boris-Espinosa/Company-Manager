import { Request, Response } from "express";
import { UsersService } from "../services/users.service.ts";
import { AppError } from "../common/AppError.class.ts";

export class UsersController {
  constructor(private usersService: UsersService) {}

  create = async (req: Request, res: Response) => {
    try {
      const user = req.body;
      const response = await this.usersService.create(user);
      return res.status(201).json(response);
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const response = await this.usersService.getAll(
        //TODO DELETE AND REPLACE BY CLIENT USER EXTRACTED FROM TOKEN
        ""
      );
      return res.status(201).json(response);
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const email = req.body;
      const response = await this.usersService.getOne(
        email,
        //TODO DELETE EMAIL AND REPLACE BY CLIENT USER EXTRACTED FROM TOKEN
        email
      );
      return res.status(201).json(response);
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const response = await this.usersService.update(
        req.params.id,
        updates,
        //TODO DELETE UPDATES AND REPLACE BY CLIENT USER EXTRACTED FROM TOKEN
        updates
      );
      return res.status(201).json(response);
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
      }
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      //TODO DELETE UPDATES AND REPLACE BY CLIENT USER EXTRACTED FROM TOKEN
      const updates = req.body;
      const response = await this.usersService.delete(req.params.id, updates);
      return res.status(201).json(response);
    } catch (err: any) {
      if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
      }
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
