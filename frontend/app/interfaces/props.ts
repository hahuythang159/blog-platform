import { ProfileData } from "./profileData";

export interface Props {
    profile: ProfileData;
    setProfile: (profile: ProfileData) => void;
}