export type User = {
    _id: string,
    email?: string,
    username: string,
    token: string,
    role: string,
    activeBan?: {
        reason: string;
    };
}
