import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    notification: {
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    } | null;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Collection {
    id: number;
    name: string;
    slug: string;
    thumbnail_path: string;
    description: string;
    created_at: string;
    updated_at: string;
    user: User;

    panels: Panel[];
}

export interface Panel {
    id: number;
    name: string;
    sort: number;
    visibility: { [key: string]: unknown } | null;
    created_at: string;
    updated_at: string;

    collection: Collection;
    fields: Field[];
}

export interface Field {
    id: number;
    key: string;
    label: string;
    type: string;
    required: boolean;
    sort: number;
    config: { [key: string]: unknown } | null;
    created_at: string;
    updated_at: string;
    panel: Panel;
}
