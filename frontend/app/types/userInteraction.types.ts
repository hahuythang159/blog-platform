export type InteractionType = "view" | "like" | "comment"

export type UserInteraction = {
    _id: string
    type: InteractionType
    post: {
        _id: string
        title: string
    }
    tags: { name: string, slug: string }[]
    createdAt: string
}