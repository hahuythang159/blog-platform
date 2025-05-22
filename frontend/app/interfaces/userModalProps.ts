import { User } from "@/app/interfaces/user";
import { ToggleBanParams } from "@/app/interfaces/toggleBan";

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onToggleBan: (params: ToggleBanParams) => void;
}
