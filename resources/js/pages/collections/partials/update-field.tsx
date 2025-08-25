import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { LoaderCircle, X } from 'lucide-react';
import React, { useEffect } from 'react';
import useUniqueId from '@/hooks/use-unique-id';
import { Field } from '@/types';

type Form = {
    id: number | undefined;
    key: string;
    label: string;
    type: string;
    required: boolean;
    options: Array<{ id: string; value: string; }>;
}

type UpdateFieldProps = {
    onUpdateField?: (field: Field) => void;
    initial: Field;
    open?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}

export default function UpdateField({ onUpdateField, initial, open, onClose, children }: UpdateFieldProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<Form>>({
        id: undefined,
        key: '',
        label: '',
        type: '',
        options: [],
        required: false,
    });

    const { id } = useUniqueId();

    useEffect(() => {
        if (!open) return;
        if (!initial) return;
        setData({
            id: initial.id,
            key: initial.key,
            label: initial.label,
            type: initial.type,
            required: initial.required,
            options: initial.config?.options?.map(v => ({ id: id(), value: v })) ?? [],
        });
    }, [open, initial]);

    const submit = () => {
        post(route('fields.validate'), {
            onSuccess: () => {
                const fieldForParent: Field = {
                    ...initial,
                    key: data.key,
                    label: data.label,
                    type: data.type,
                    required: data.required,
                    config: {
                        ...(initial.config ?? {}),
                        options: data.options.map(o => o.value),
                    },
                };
                onUpdateField?.(fieldForParent);
                onClose?.();
                // reset('key', 'type', 'required', 'options', 'label');
                // Close the dialog after a successful submission
            }
        });
    }

    const updateOptionValue = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        setData(prev => {
            const next = [...prev.options];
            next[index] = { ...next[index], value };
            return { ...prev, options: next };
        });
    }

    const addOption = () => {
        setData('options', [...data.options, { id: Math.floor(Math.random() * 100).toString(), value: '' }])
    }

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Feld bearbeiten
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="border py-3 px-4 rounded-md border-dashed text-sm">
                        <strong>Tipp!</strong> <br/>
                        <p className="text-muted-foreground">
                            Du kannst auch vom System generierte Felder zu deinen Panels hinzufügen. Wir geben hier die Feld-Keys an, und erklären kurz, was das Feld darstellt.

                            <ul className="mt-3">
                                <li>
                                    <strong>id</strong> = Die ID deines Eintrages.
                                </li>
                                <li>
                                    <strong>created_at</strong> = Das Erstellungsdatum des Eintrages.
                                </li>
                                <li>
                                    <strong>updated_at</strong> = Das Datum, an dem der Eintrag aktualisiert wurde.
                                </li>
                            </ul>

                            <div className="mt-3">
                                Wenn du einen dieser Feld-Keys verwendest, wird die Feldart automatisch bestimmt.
                            </div>
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label required>
                            Feld-Key{' '}
                            <span className="text-muted-foreground">
                                (<strong>Dieser Key muss einzigartig sein</strong>)
                            </span>
                        </Label>
                        <Input
                            value={data.key}
                            onChange={(e) => setData('key', e.target.value)}
                            placeholder="ein_eindeutiger_schlüssel" />
                        <InputError message={errors.key} />
                    </div>
                    <div className="grid gap-2">
                        <Label required>Label</Label>
                        <Input
                            value={data.label}
                            onChange={(e) => setData('label', e.target.value)}
                            placeholder="Mein neues Feld" />
                        <InputError message={errors.label} />
                    </div>

                    <div className="grid gap-2">
                        <Label required>Feldart</Label>
                        <Select value={data.type}
                                onValueChange={(value) => setData('type', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Feldart auswählen..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="date">Datum</SelectItem>
                                    <SelectItem value="datetime-local">Datum und Uhrzeit</SelectItem>
                                    <SelectItem value="select">Auswahlliste</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    {data.type === 'select' && <div>
                        <div className="flex items-center justify-between">
                            <Label>
                                Auswahlliste-Elemente
                            </Label>

                            <Button variant="link" onClick={addOption}>
                                Element hinzufügen
                            </Button>
                        </div>

                        <div className="mt-4 space-y-2">
                            {data.options?.map((option, index) => (
                                <div key={option.id}>
                                    <div className="flex items-center gap-2">
                                        <Input value={option.value} onChange={(e) => updateOptionValue(e, index)} />
                                        <Button variant="outline" onClick={() => setData('options', data.options.filter((option, optIndex) => index !== optIndex))}>
                                            <X />
                                        </Button>
                                    </div>
                                    <InputError message={errors?.[`options.${index}.value`]} />
                                </div>
                            ))}
                        </div>
                    </div>}

                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Switch checked={data.required} onCheckedChange={v => setData('required', v)} id="required" />
                            <Label htmlFor="required">Soll dieses Feld verpflichtend sein?</Label>
                        </div>
                        <InputError message={errors.required} />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => onClose?.()}>Abbrechen</Button>
                    </DialogClose>
                    <Button onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="animate-spin" />}
                        Feld speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
