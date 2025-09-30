import { Request, Response } from "express";
import { registerUserService } from "../services/auth.service";

export async function registerUser(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await registerUserService(email);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
}
