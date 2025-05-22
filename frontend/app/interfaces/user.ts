export interface User {
    _id: string,
    email?: string,
    username: string,
    token: string,
    activeBan?: {
        reason: string;
    };
}
