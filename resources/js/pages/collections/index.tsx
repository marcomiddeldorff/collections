import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, Collection } from '@/types';
import { Button } from '@/components/ui/button';
import HeadingSmall from '@/components/heading-small';
import { Plus } from 'lucide-react';
import DeleteCollection from '@/pages/collections/partials/delete-collection';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sammlungen',
        href: '/collections',
    }
]

export default function Collections({ collections } : { collections: Array<Collection> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sammlungen" />

            <div className="p-4">
                <div className="flex items-center justify-between">
                    <HeadingSmall title="Sammlungen"
                                  description="Erstelle und verwalte deine Sammlungen."
                    />

                    <Link href={route('collections.create')}>
                        <Button size="sm" variant="outline">
                            <Plus />
                            Sammlung erstellen
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 auto-rows-min auto-cols-min gap-4 mt-8">
                    {collections.map((collection) => (
                        <div className="border rounded-lg" key={collection.id}>
                            <div className="flex flex-col h-full">
                                {collection.thumbnail_path ? <img src={`/storage${collection.thumbnail_path}`}
                                                                  className="rounded-t-lg w-full min-h-42 h-42 object-cover" alt="" />
                                : <div className="rounded-t-lg w-full min-h-42 h-42 bg-muted" />}
                                <div className="py-2 flex flex-col h-full">
                                    <div className="px-3 flex-1">
                                        <h3 className="text-lg font-semibold">{collection.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {collection.description}
                                        </p>
                                    </div>

                                    <p className="mt-4 px-3 text-sm text-muted-foreground">
                                        Erstellt am: {collection.created_at}
                                    </p>

                                    <div className="mt-3 border-t pt-2 px-3 flex gap-x-2">
                                        <Link href={route('collections.show', collection.id)}
                                                  className="w-full">
                                            <Button className="w-full">
                                                Sammlung öffnen
                                            </Button>
                                        </Link>

                                        <Link href={route('collections.edit', collection.id)}>
                                            <Button className="w-full" variant="warning">
                                                Bearbeiten
                                            </Button>
                                        </Link>

                                        <DeleteCollection collection={collection} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
