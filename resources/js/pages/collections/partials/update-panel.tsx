import React, { useEffect, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Collection, Field, Panel } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { LoaderCircle, Pencil, X } from 'lucide-react';
import AddField from '@/pages/collections/partials/add-field';
import { Badge } from '@/components/ui/badge';
import UpdateField from '@/pages/collections/partials/update-field';

type UpdatePanelProps = {
    children: React.ReactNode;
    collection: Collection;
    panel: Panel;
    open?: boolean;
    onClose?: () => void;
    onSubmit?: () => void;
}

type Form = {
    id: number | undefined;
    name: string;
    fields: Array<Field>;
}

export default function UpdatePanel({ children, open, onClose, onSubmit, collection, panel }: UpdatePanelProps) {
    const { data, setData, processing, errors, put } = useForm<Required<Form>>({
        id: undefined,
        name: '',
        fields: []
    });

    useEffect(() => {
        if (!panel) return;
        setData({
            id: panel.id,
            name: panel.name,
            fields: panel.fields,
        });

        console.log('was triggered');
    }, [open, panel?.id]);

    const submit = () => {
        put(route('collections.panels.update', { collection: collection.id, panel: panel.id }), {
            onSuccess: () => {
                onSubmit?.();
            }
        });
    }

    const removeField = (index: number) => {
        setData('fields', data.fields.filter((_, i) => i !== index));
    }

    const onAddField = (field: {
        key: string;
        label: string;
        type: string;
        required: boolean;
        options: Array<{ id: string; value: string; }>;
    }) => {
        setData('fields', [...data.fields, field])
    }

    const [openAddFieldModal, setOpenAddFieldModal] = useState(false);

    const updateField = (updated: Field) => {
        // Bilde die neue Felderliste auf Basis des aktuellen data.fields
        const nextFields = data.fields.map((f) => {
            if (f.key !== updated.key) return f;

            return {
                ...f,
                key: updated.key,
                label: updated.label,
                type: updated.type,
                required: updated.required,
                config: {
                    ...(f.config ?? {}),
                    // UpdateField liefert bereits string[] für options
                    options: updated.config?.options ?? [],
                },
            };
        });

        setData('fields', nextFields);
        setEditingKey(null);
    };
    const [editingKey, setEditingKey] = useState<string|null>(null);

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="2xl:max-w-4xl w-full">
                <DialogHeader>
                    <DialogTitle>
                        Panel aktualisieren
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>
                                Name des Panels
                            </Label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Mein neues Panel" />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>
                                    Felder
                                </Label>
                                <AddField open={openAddFieldModal}
                                          onClose={() => setOpenAddFieldModal(false)}
                                          onAddField={onAddField}>
                                    <Button disabled={processing} onClick={() => setOpenAddFieldModal(true)} variant="link">Neues Feld hinzufügen</Button>
                                </AddField>
                            </div>

                            <div className="mt-4 grid gap-4">
                                {data.fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center justify-between border p-4 rounded-lg">
                                        <div className="flex items-center w-full gap-8">
                                            <Label>
                                                {field.label}
                                            </Label>

                                            <span className="text-sm text-muted-foreground">
                                                {field.type}
                                            </span>

                                            <div>
                                                {field.required && <Badge variant="destructive">Verpflichtend</Badge>}
                                            </div>

                                            <div className="flex-1">
                                                {field.type === 'select' && (field.config?.options?.length ?? 0)} Elemente
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <UpdateField initial={field}
                                                             key={field.key}
                                                             open={editingKey === field.key}
                                                             onClose={() => setEditingKey(null)}
                                                             onUpdateField={(field) => updateField(field)}>
                                                    <Button variant="ghost"
                                                            onClick={() => setEditingKey(field.key)}
                                                            size="sm"
                                                            className="hover:bg-zinc-700"
                                                    >
                                                        <Pencil className="text-yellow-500" width={18} />
                                                    </Button>
                                                </UpdateField>
                                                <Button
                                                        onClick={() => removeField(index)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="hover:bg-zinc-700">
                                                    <X width={18} className="text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <InputError message={errors.fields} />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Abbrechen
                        </Button>
                    </DialogClose>
                    <Button onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="animate-spin" />}
                        Panel aktualisieren
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
