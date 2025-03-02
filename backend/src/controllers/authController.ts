import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({username, email, password: hashedPassword});
    await user.save();
    
    res.status(201).json({ message: "User registered successfully"});
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password} = req.body;
    const user = await User.findOne({email});
    
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({token: generateToken(user.id)});
    } else {
        res.status(401).json({ message: "Invalid credentials"});
    }
}