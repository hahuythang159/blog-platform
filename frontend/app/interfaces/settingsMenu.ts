export interface SettingsMenuProps {
    // onLogout function passed as a prop to handle logout logic
    onLogout: () => void;

    // onToggleTheme function passed as a prop to toggle dark/light theme
    onToggleTheme: () => void;

    // prop for navigating to the Account Settings page
    onAccountSettings: () => void;
}