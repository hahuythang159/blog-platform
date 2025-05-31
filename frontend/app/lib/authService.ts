import { LoginForm, LoginResponse, RegisterForm } from "../types";
import { fetcher } from "../utils/fetcher";

export const login = async (form: LoginForm): Promise<LoginResponse> => {
    const data = await fetcher('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
    return data;
};

export const register = async (form: RegisterForm): Promise<void> => {
    await fetcher('auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
}
