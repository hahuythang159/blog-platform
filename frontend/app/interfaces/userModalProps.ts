import { User } from "@/app/types/user.types";
import { ToggleBanParams } from "@/app/types/toggleBan.types";

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onToggleBan: (params: ToggleBanParams) => void;
}
