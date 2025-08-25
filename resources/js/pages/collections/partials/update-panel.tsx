import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AddField from '@/pages/collections/partials/add-field';
import UpdateField from '@/pages/collections/partials/update-field';
import { Collection, Field, Panel } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Info, LoaderCircle, Pencil, X } from 'lucide-react';
import { Reorder } from 'motion/react';
import React, { useEffect, useState } from 'react';

type UpdatePanelProps = {
    children: React.ReactNode;
    collection: Collection;
    panel: Panel;
    open?: boolean;
    onClose?: () => void;
    onSubmit?: () => void;
    onOpenChange?: (value: boolean) => void;
};

type Form = {
    id: number | undefined;
    name: string;
    fields: Array<Field & { willDelete: boolean }>;
};

export default function UpdatePanel({ children, open, onClose, onSubmit, collection, panel, onOpenChange }: UpdatePanelProps) {
    const { data, setData, processing, errors, put } = useForm<Required<Form>>({
        id: undefined,
        name: '',
        fields: [],
    });

    useEffect(() => {
        if (!panel) return;
        setData({
            id: panel.id,
            name: panel.name,
            fields: panel.fields,
        });
    }, [open, panel?.id]);

    const submit = () => {
        put(route('collections.panels.update', { collection: collection.id, panel: panel.id }), {
            onSuccess: () => {
                onSubmit?.();
                onClose?.();
            },
        });
    };

    const removeField = (index: number) => {
        setData((prev) => {
            const next = [...prev.fields];
            next[index].willDelete = true;
            return { ...prev, fields: next };
        });
    };

    const undoRemoveField = (index: number) => {
        setData((prev) => {
            const next = [...prev.fields];
            next[index].willDelete = false;
            return { ...prev, fields: next };
        });
    };

    const onAddField = (field: { key: string; label: string; type: string; required: boolean; options: Array<{ id: string; value: string }> }) => {
        setData('fields', [...data.fields, { ...field, willDelete: false }]);
    };

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
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const onReorder = (fields: Field[]) => {
        setData('fields', fields);

        router.put(
            route('panels.fields.update.order', {
                collection: collection.id,
            }),
            {
                fields,
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={(value) => onOpenChange?.(value)}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-full 2xl:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Panel aktualisieren</DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Name des Panels</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Mein neues Panel" />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-x-3">
                                    <Label>Felder</Label>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info width={15} className="text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Du kannst automatisch festgelegte Felder, wie die ID, das Erstellungsdatum und das Aktualisierungsdatum
                                             eines Eintrages verwenden. <br /> <br/>
                                            Verwende dazu bitte die folgenden Key's für die Felder: <br />
                                            <ul>
                                                <li>
                                                    Key = id (Die ID)
                                                </li>
                                                <li>
                                                    Key = created_at (Das Erstellungsdatum)
                                                </li>
                                                <li>
                                                    Key = updated_at (Das Aktualisierungsdatum)
                                                </li>
                                            </ul>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <AddField open={openAddFieldModal} onClose={() => setOpenAddFieldModal(false)} onAddField={onAddField}>
                                    <Button disabled={processing} onClick={() => setOpenAddFieldModal(true)} variant="link">
                                        Neues Feld hinzufügen
                                    </Button>
                                </AddField>
                            </div>

                            <div className="mt-4">
                                <Reorder.Group className="mt-4 grid gap-4" axis="y" values={data.fields} onReorder={onReorder}>
                                    {data.fields.map((field, index) => (
                                        <Reorder.Item key={field.id} value={field}>
                                            <div key={field.id} className="flex cursor-row-resize items-center justify-between rounded-lg border p-4">
                                                <div className="flex w-full items-center gap-8">
                                                    <Label>{field.label}</Label>

                                                    <span className="text-sm text-muted-foreground">{field.type}</span>

                                                    <div>{field.required && <Badge variant="destructive">Verpflichtend</Badge>}</div>

                                                    {field.type === 'select' ? (
                                                        <div className="flex-1">{field.config?.options?.length ?? 0} Elemente</div>
                                                    ) : (
                                                        <div className="flex-1"></div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <UpdateField
                                                            initial={field}
                                                            key={field.key}
                                                            open={editingKey === field.key}
                                                            onClose={() => setEditingKey(null)}
                                                            onUpdateField={(field) => updateField(field)}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => setEditingKey(field.key)}
                                                                size="sm"
                                                                className="hover:bg-zinc-700"
                                                            >
                                                                <Pencil className="text-yellow-500" width={18} />
                                                            </Button>
                                                        </UpdateField>
                                                        {!field.willDelete ? (
                                                            <Button
                                                                onClick={() => removeField(index)}
                                                                size="sm"
                                                                variant="ghost"
                                                                className="hover:bg-zinc-700"
                                                            >
                                                                <X width={18} className="text-red-500" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                onClick={() => undoRemoveField(index)}
                                                                variant="ghost"
                                                                className="text-red-500"
                                                                size="sm"
                                                            >
                                                                Löschen abbrechen
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
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
