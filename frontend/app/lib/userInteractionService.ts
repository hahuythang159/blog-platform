import { recordInteractionInput } from "../types";
import { fetcher } from "../utils/fetcher";
import { getToken } from "../utils/token";

export const recordInteraction = async ({ postId, type }: recordInteractionInput) => {
    return await fetcher("user-interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ postId, type })
    })
}

export const getUserInteractions = async () => {
    return await fetcher("user-interactions", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` }
    })
}