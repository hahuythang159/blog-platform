import jwt from "jsonwebtoken";

const generateToken = (_id: string, username: string): string => {
    return jwt.sign({ _id, username }, process.env.JWT_SECRET as string, {expiresIn: "30d"});
}

export default generateToken;