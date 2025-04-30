export interface ProfileData {
    bio: string;
    avatar: string;
    birthday: string;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    location: string;
}