import { Request, Response } from "express";
import User from "../../models/user";

const registerController = async (req: Request, res: Response) => {
  const { firstName, lastName, email, middleName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    console.log({existingUser});
    // if (existingUser) {
    //   return res.status(400).json({ error: "Email already registered" });
    // }

    // Create new user
    // const newUser = await User.create({firstName, lastName, email, middleName });

    // Return the new user
    // res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export { registerController };
