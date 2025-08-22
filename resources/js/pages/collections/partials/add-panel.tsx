import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AddField from '@/pages/collections/partials/add-field';
import { useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { LoaderCircle, Pencil, X } from 'lucide-react';
import React, { useState } from 'react';
import { Collection, Panel } from '@/types';
import InputError from '@/components/input-error';

type Form = {
    name: string;
    fields: Array<Field>;
}

type Field = {
    key: string;
    label: string;
    type: string;
    required: boolean;
    options: Array<{ id: string; value: string; }>;
};

type AddPanelProps = {
    collection: Collection;
    children?: React.ReactNode;
}

export default function AddPanel({ collection, children }: AddPanelProps) {

    const { data, setData, processing, errors, post } = useForm<Required<Form>>({
        name: '',
        fields: [],
    })


    const [openAddOrUpdateFieldModal, setOpenAddOrUpdateFieldModal] = useState(false);

    const onAddField = (field: Field) => {
        const index = data.fields.findIndex((f) => f.key === field.key);

        if (index > -1) {
            const fields = [...data.fields];
            fields[index] = field;
            setData('fields', fields);
            return;
        }

        setData('fields', [...data.fields, field]);
        setOpenAddOrUpdateFieldModal(false);
    }

    const removeField = (field: Field, index: number) => {
        setData('fields', data.fields.filter((_, fieldIndex) => fieldIndex !== index));
    }

    const [initialFieldForUpdateModal, setInitialFieldForUpdateModal] = useState<Field | null>(null);

    const updateField = (field: Field) => {
        setInitialFieldForUpdateModal(field);
        setOpenAddOrUpdateFieldModal(true);
    }

    const closeAddOrUpdateFieldModal = () => {
        setInitialFieldForUpdateModal(null);
        setOpenAddOrUpdateFieldModal(false);
    }

    const submit = () => {
        post(route('panels.store', collection.id))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="2xl:max-w-4xl w-full">
                <DialogHeader>
                    <DialogTitle>
                        Neues Panel erstellen
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

                        <div></div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>
                                    Felder
                                </Label>
                                <AddField open={openAddOrUpdateFieldModal}
                                          initial={initialFieldForUpdateModal}
                                          onClose={closeAddOrUpdateFieldModal}
                                          onAddField={onAddField}>
                                    <Button disabled={processing} onClick={() => setOpenAddOrUpdateFieldModal(true)} variant="link">Neues Feld hinzufügen</Button>
                                </AddField>
                            </div>

                            <div className="mt-4 grid gap-4">
                                {data.fields.map((field, index) => (
                                    <div key={index} className="flex items-center justify-between border p-4 rounded-lg">
                                        <div className="flex items-center w-full gap-8">
                                            <Label>
                                                {field.label}
                                            </Label>

                                            <span className="text-sm text-muted-foreground">
                                                {field.type}
                                            </span>

                                            <div className="flex-1">
                                                {field.required && <Badge variant="destructive">Verpflichtend</Badge>}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost"
                                                        size="sm"
                                                        className="hover:bg-zinc-700"
                                                        onClick={() => updateField(field)}>
                                                    <Pencil className="text-yellow-500" width={18} />
                                                </Button>
                                                <Button onClick={() => removeField(field, index)}
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

                        <div></div>

                        <div className="text-right">
                            <Button type="submit" onClick={submit}>
                                {processing && <LoaderCircle className="animate-spin" />}
                                Panel speichern
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
