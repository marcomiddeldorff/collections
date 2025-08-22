import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BreadcrumbItem, Collection } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import slugify from 'slugify';
import React, { FormEventHandler } from 'react';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/file-upload';

type Form = {
    name: string;
    slug: string;
    description: string;
    thumbnail: File | string | undefined;
    _method: string;
}

export default function CreateCollection({ collection }: { collection: Collection}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Sammlungen',
            href: '/collections',
        },
        {
            title: collection.name,
            href: `/collections/${collection.id}`
        },
        {
            title: 'Sammlung aktualisieren',
            href: `/collections/${collection.id}/edit`,
        }
    ]

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm<Required<Form>>({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        thumbnail: collection.thumbnail_path ? '/storage'+collection.thumbnail_path : undefined,
        _method: 'PUT'
    });

    const updateName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('name', e.target.value);
        setData('slug', slugify(e.target.value, {
            lower: true,
            strict: true,
            trim: true
        }))
    }

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('collections.update', collection.id))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sammlung aktualisieren" />

            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <HeadingSmall title="Sammlung aktualisieren" description="Aktualisiere deine bestehende Sammlung." />

                    <Link href={route('collections.index')}>
                        <Button size="sm" variant="outline">
                            <ChevronLeft />
                            Zurück
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Informationen zur Sammlung
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>
                                    Name der Sammlung <span className="text-red-600">*</span>
                                </Label>
                                <Input value={data.name} onChange={updateName} placeholder="Meine tolle Sammlung" />
                                <InputError message={errors.name} />
                            </div>
                            <div></div>
                            <div className="grid gap-2">
                                <Label>
                                    Slug
                                </Label>
                                <Input value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                                <small className="text-muted-foreground">
                                    Dieses Feld wird automatisch, basierend auf dem Namen der Sammlung, befüllt.
                                </small>
                                <InputError message={errors.slug} />
                            </div>
                            <div></div>
                            <div className="grid gap-2">
                                <Label>
                                    Beschreibung
                                </Label>
                                <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </div>
                            <div></div>

                            <div className="grid gap-2">
                                <Label>
                                    Thumbnail
                                </Label>
                                <FileUpload previewUrl={data.thumbnail} height="min-h-24"
                                            onChange={(file) => setData('thumbnail', file)} />
                                <InputError message={errors.thumbnail} />
                            </div>

                            <div></div>
                            <div className="text-right">
                                <div className="flex items-center gap-2">
                                    <Button>
                                        {processing && <LoaderCircle className="animate-spin" />}
                                        Speichern
                                    </Button>

                                    {recentlySuccessful && <span className="text-neutral-500">
                                        Gespeichert.
                                    </span>}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
