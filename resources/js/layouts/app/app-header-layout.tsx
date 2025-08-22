import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem, SharedData } from '@/types';
import { PropsWithChildren, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { notification } = usePage<SharedData>().props;

    useEffect(() => {
        if (notification) {
            switch (notification.type) {
                case 'success':
                    toast.success(notification.message);
                    break;
                case 'error':
                    toast.error(notification.message);
                    break;
                case 'warning':
                    toast.warning(notification.message);
                    break;
                case 'info':
                    toast.info(notification.message);
            }
        }
    }, [notification]);

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
