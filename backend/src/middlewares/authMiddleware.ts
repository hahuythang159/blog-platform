import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, {IUser} from "../models/User";

interface AuthRequest extends Request {
    user?: IUser;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if(token && token.startsWith("Bearer")){
        try{
            const decoded: any = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET as string);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized, invalid token"});
        }
    } else {
        res.status(401).json({ message: "Unauthorized, no token"});
    }
};

export {protect};