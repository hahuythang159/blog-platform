import { useEffect, useState } from "react"
import { UserInteraction } from "../types"
import { getUserInteractions } from "../lib/userInteractionService"

export const useUserInteractions = () => {
    const [interactions, setInteractions] = useState<UserInteraction[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchInteractions = async () => {
            try {
                setLoading(true)
                const data = await getUserInteractions()
                setInteractions(data)
            } catch (err: any) {
                setError(err.message || 'Failed to load interactions')
            } finally {
                setLoading(false)
            }
        }
        fetchInteractions()
    }, [])

    return { interactions, loading, error }
}