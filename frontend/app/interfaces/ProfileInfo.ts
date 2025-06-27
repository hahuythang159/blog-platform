import { Profile } from "../types";

export interface ProfileInfoProps {
    profile: Profile;
    isFollowing: boolean;
    isProcessing: boolean;
    onToggleFollow: () => void;
    loggedInUser: any;
}