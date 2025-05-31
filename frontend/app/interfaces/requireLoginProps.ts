export interface RequireLoginDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}