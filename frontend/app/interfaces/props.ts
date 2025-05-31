import { ProfileData } from "../types/profileData.types";

export interface Props {
    profile: ProfileData;
    setProfile: (profile: ProfileData) => void;
}