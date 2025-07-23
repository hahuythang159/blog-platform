import { useCallback, useState } from "react"
import { InteractionType } from "../types"
import { recordInteraction } from "../lib/userInteractionService"

export const useRecordInteraction = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const triggerInteraction = useCallback(async (postId: string, type: InteractionType) => {
        try {
            if (!postId) return;

            const key = `interaction_${type}_${postId}`;
            const cooldown = 60;

            if (type === 'view') {
                const lastViewed = sessionStorage.getItem(key);
                const now = Date.now();

                if (lastViewed && now - parseInt(lastViewed, 10) < cooldown * 1000) {
                    return; // Recorded recently (view), skip
                }
            }

            setLoading(true);
            setError(null);

            await recordInteraction({ postId, type });

            // If it's a view, save the timestamp to sessionStorage
            if (type === 'view') {
                sessionStorage.setItem(key, Date.now().toString());
            }

        } catch (error: any) {
            setError(error.message || 'Interaction failed')
        } finally {
            setLoading(false)
        }
    }, []);
    return { triggerInteraction, loading, error }
}