import { ReactNode } from "react";

export interface PostsLayoutProps {
    children: ReactNode;
    tab?: 'foryou' | 'following';
    onTabChange?: (value: 'foryou' | 'following') => void;
    showTabs?: boolean;
};