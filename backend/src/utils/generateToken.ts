import jwt from "jsonwebtoken";

const generateToken = (id: string, username: string): string => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET as string, {expiresIn: "30d"});
}

export default generateToken;