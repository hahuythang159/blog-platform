import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) : Promise<any> => {
    const { username, email, password } = req.body;

    const existingEmail = await User.findOne({ email })

    if(existingEmail){
        return res.status(400).json({ message: "Email already exist "})
    }

    const existingUsername = await User.findOne({ username});

    if(existingUsername){
        return res.status(400).json({ message: "Username already exist"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({username, email, password: hashedPassword});
    await user.save();
    
    return res.status(201).json({ message: "User registered successfully"});
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password} = req.body;
    const user = await User.findOne({email});
    
    if(user && (await bcrypt.compare(password, user.password))){
        return res.json({token: generateToken(user.id, user.username)});
    } else {
        return res.status(401).json({ message: "Invalid credentials"});
    }
}