import { useEffect, useState } from 'react';
import { getPostStats } from '../lib/postService';

export const usePostStats = (postId: string) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!postId) return;

        const loadStats = async () => {
            try {
                const data = await getPostStats(postId);
                setStats(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [postId]);

    return { stats, setStats, loading, error };
};
