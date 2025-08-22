import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import AddPanel from '@/pages/collections/partials/add-panel';
import UpdatePanel from '@/pages/collections/partials/update-panel';
import VisibilitySettings from '@/pages/collections/partials/visibility-settings';
import { BreadcrumbItem, Collection, Panel } from '@/types';
import { Head, router } from '@inertiajs/react';
import { LayoutGrid, Pencil, Trash } from 'lucide-react';
import { Reorder, useDragControls } from 'motion/react';
import { useState } from 'react';

export default function Show({ collection }: { collection: Collection }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Sammlungen',
            href: '/collections',
        },
        {
            title: collection.name,
            href: `/collections/${collection.id}`,
        },
    ];

    const [panels, setPanels] = useState(collection.panels);

    const onReorder = (data: Panel[]) => {
        setPanels(data);

        router.put(route('panels.update.order', {
            collection: collection.id
        }), {
            panels: data
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={collection.name} />

            <div className="p-4">
                <HeadingSmall title="Sammlungsdetails anzeigen" description="Verwalte deine Sammlung." />

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <Card className="overflow-hidden rounded-t-lg !p-0">
                            <CardContent className="!p-0">
                                {collection.thumbnail_path ? (
                                    <img src={`/storage${collection.thumbnail_path}`} className="h-42 w-full object-cover" alt="" />
                                ) : null}
                                <div className="grid gap-4 p-4">
                                    <div>
                                        <small className="text-sm text-muted-foreground">Name der Sammlung</small>
                                        <p>{collection.name}</p>
                                    </div>
                                    <div>
                                        <small className="text-sm text-muted-foreground">Beschreibung</small>
                                        <p>{collection.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-8">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Panels</CardTitle>

                                    <AddPanel collection={collection}>
                                        <Button variant="link">Neues Panel erstellen</Button>
                                    </AddPanel>
                                </div>
                                <CardDescription>Hier kannst du deine Panels für diese Sammlung verwalten.</CardDescription>
                            </CardHeader>

                            <CardContent className="!p-0 !py-12">
                                <Reorder.Group axis="y" values={panels} onReorder={onReorder}>
                                    {panels.map((panel) => (
                                        <Reorder.Item key={panel.id} value={panel}>
                                            <div key={panel.name} className="flex items-center justify-between border-b px-5 py-4 first:border-t">
                                                <div className="w-[20%]">{panel.name}</div>
                                                <div>
                                                    <VisibilitySettings collection={collection} panel={panel}>
                                                        <Button variant="link">Sichtbarkeits-Regeln</Button>
                                                    </VisibilitySettings>
                                                </div>
                                                <div className="text-sm">{panel.fields.length} Feld(er)</div>
                                                <div className="flex items-center gap-2">
                                                    <UpdatePanel key={panel.id} collection={collection} panel={panel}>
                                                        <Button size="sm" variant="ghost" className="hover:bg-zinc-800">
                                                            <Pencil width={18} className="text-yellow-500" />
                                                        </Button>
                                                    </UpdatePanel>
                                                    <Button size="sm" variant="ghost" className="hover:bg-zinc-800">
                                                        <Trash width={18} className="text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
