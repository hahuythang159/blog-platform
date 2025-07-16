export type InteractionType = 'view' | 'like' | 'comment';

export const VALID_TYPES: InteractionType[] = ['view', 'like', 'comment'];

export const INTERACTION_COOLDOWN: Record<InteractionType, number> = {
    view: 60,   // seconds
    like: 0,
    comment: 0,
};
