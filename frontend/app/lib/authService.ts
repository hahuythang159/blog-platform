import { LoginForm, LoginResponse, RegisterForm } from "../types";
import { fetcher } from "../utils/fetcher";

/**
 * Sends a login request to the backend API.
 * @param form - The login form data containing email and password
 * @returns Promise resolving to the login response data (e.g., token)
 */
export const login = async (form: LoginForm): Promise<LoginResponse> => {
    const data = await fetcher('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
    return data;
};

/**
 * Sends a registration request to the backend API.
 * @param form - The registration form data containing email, username and password
 * @returns Promise resolving when the registration completes successfully
 */
export const register = async (form: RegisterForm): Promise<void> => {
    await fetcher('auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
}
