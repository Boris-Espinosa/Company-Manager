import { AppError } from "../common/AppError.class.ts";
import { pool } from "../database/connection.ts";
import * as bcrypt from "bcrypt";

//TODO ADD VALIDATION OF CLIENT USER TO ALL FUNCTIONS EXCEPT OF CREATE
export class UsersService {
  create = async (user: any) => {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [user.email]
    );
    if (userExists.rows[0]) throw new AppError("Email already exists", 400);

    const passwordHash = await bcrypt.hash(user.password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [user.name, user.email, passwordHash]
    );

    const response = await pool.query("SELECT * FROM users WHERE email = $1", [
      user.email,
    ]);
    return response.rows[0];
  };

  getAll = async (clientUser: any) => {
    const response = await pool.query("SELECT * FROM users;");
    return response.rows;
  };

  getOne = async (email: string, clientUser: any) => {
    const response = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return response.rows[0];
  };

  update = async (target: any, updates: any, clientUser: any) => {
    const user = await pool
      .query("SELECT * FROM users WHERE id = $1", [Number(target)])
      .then((res) => res.rows[0]);
    if (!user) throw new AppError("User does not exists", 400);

    if (updates.email) {
      const emailInUse = await pool
        .query("SELECT * FROM users WHERE email = $1", [updates.email])
        .then((res) => res.rows[0]);
      if (emailInUse) throw new AppError("Email is already in use", 400);
    }

    await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
      [
        updates.name ?? user.name,
        updates.email ?? user.email,
        updates.password ?? user.password,
        target,
      ]
    );
  };

  delete = async (target: any, clientUser: any) => {
    const user = await pool
      .query("SELECT * FROM users WHERE id = $1", [Number(target)])
      .then((res) => res.rows[0]);
    if (!user) throw new AppError("User does not exists", 400);

    const response = await pool.query("DELETE * FROM users WHERE id = $1", [
      Number(target),
    ]);
    return { message: "User deleted successfully" };
  };
}
