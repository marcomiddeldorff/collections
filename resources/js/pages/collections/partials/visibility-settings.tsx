import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { Collection, Field, Panel } from '@/types';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Trash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import useUniqueId from '@/hooks/use-unique-id';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';


type VisibilitySettingsProps = {
    children: React.ReactNode;
    onClose?: () => void;
    onSubmit?: () => void;
    key?: string;
    panel: Panel;
    collection: Collection;
}

type Condition = {
    id: number;
    field: string;
    operator: string;
    value: string | { id: number; value: string; }[];
};

type Form = {
    logic: "ALL" | "ANY";
    conditions: Array<Condition>;
}

export default function VisibilitySettings({ key, children, onClose, onSubmit, panel, collection }: VisibilitySettingsProps) {
    const { data, setData, processing, errors, put } = useForm<Required<Form>>({
        logic: 'ANY',
        conditions: []
    })

    useEffect(() => {
        if (panel) {
            setData({
                logic: panel.visibility?.logic ?? 'ANY',
                conditions: panel.visibility?.conditions ?? []
            })
        }
    }, [panel.id]);

    const close = () => {
        onClose?.();
    }

    const submit = () => {
        put(route('panels.update.visibility', {
            collection: collection.id,
            panel: panel.id
        }), {
            onSuccess: () => {
                onSubmit?.();
            }
        });
    }

    const { id } = useUniqueId();

    const addCondition = () => {
        setData('conditions', [...data.conditions, {
            id: id(),
            field: '',
            operator: '',
            value: ''
        }]);
    }

    const removeRule = (index: number) => {
        setData('conditions', data.conditions.filter((_, i) => i !== index))
    }

    const setConditionOperator = (operator: string, index: number) => {
        setData(prev => {
            const next = [...prev.conditions];
            next[index].operator = operator;
            return { ...prev, conditions: next };
        });
    }

    const setConditionValue = (value: string, conditionIndex: number, conditionValueIndex?: number) => {
        setData(prev => {
            const next = [...prev.conditions];
            if (typeof next[conditionIndex].value === 'object' && conditionValueIndex) {
                next[conditionIndex].value[conditionValueIndex].value = value;
            } else {
                next[conditionIndex].value = value;
            }
            return { ...prev, conditions: next };
        });
    }

    const setConditionField = (fieldKey: string, conditionIndex: number) => {
        setData(prev => {
            const next = [...prev.conditions];
            next[conditionIndex].field = fieldKey;
            return { ...prev, conditions: next };
        });
    }

    const addConditionValue = (index: number) => {
        const next = [...data.conditions];

        if (typeof next[index].value === 'string') {
            next[index].value = [];
        }

        next[index].value.push({ id: id(), value: '' });

        setData({
            ...data,
            conditions: next
        });
    }

    const removeConditionValue = (conditionIndex: number, conditionValueIndex: number) => {
        const next = [...data.conditions];

        if (typeof next[conditionIndex].value === 'string') {
            next[conditionIndex].value = [];
        }

        next[conditionIndex].value.splice(conditionValueIndex, 1);

        setData({
            ...data,
            conditions: next
        });
    }

    return (
        <Dialog key={key}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="2xl:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>
                        Sichtbarkeits-Regeln
                    </DialogTitle>
                    <DialogDescription>
                        Hier kannst du festlegen, wann dieses Panel angezeigt werden soll.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <div>
                        <Label>
                            Wie sollen sich die Regeln verhalten?
                        </Label>
                        <Select value={data.logic} onValueChange={(value) => setData('logic', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Verhalten auswählen..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="ALL">
                                        Alle Regeln müssen erfüllt sein.
                                    </SelectItem>
                                    <SelectItem value="ANY">
                                        Mind. eine Regel muss erfüllt sein.
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-4 mt-4">
                        <div>
                            <Button onClick={addCondition} variant="link" className="text-left px-0">
                                Neue Regel hinzufügen
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {data.conditions.map((condition, index) => (
                                <div key={condition.id}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-[32%]">
                                            <Select value={condition.field} onValueChange={(value) => setConditionField(value, index)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Feld auswählen..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {collection.panels.map(panel => (
                                                        <SelectGroup key={panel.id}>
                                                            <SelectLabel>
                                                                {panel.name}
                                                            </SelectLabel>
                                                            {panel.fields.map(field => (
                                                                <SelectItem key={field.id} value={field.key}>
                                                                    {field.label} ({field.type})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors[`conditions.${index}.field`]} />
                                        </div>
                                        <div className="w-[32%]">
                                            <Select value={condition.operator} onValueChange={(value) => setConditionOperator(value, index)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Operator auswählen..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Gleich/ungleich</SelectLabel>
                                                        <SelectItem value="equals">Ist gleich</SelectItem>
                                                        <SelectItem value="not_equals">Ist ungleich</SelectItem>
                                                    </SelectGroup>

                                                    <SelectGroup>
                                                        <SelectLabel>Mengen-Operatoren</SelectLabel>
                                                        <SelectItem value="in">Ist einer von</SelectItem>
                                                        <SelectItem value="not_in">Ist keiner von</SelectItem>
                                                    </SelectGroup>

                                                    <SelectGroup>
                                                        <SelectLabel>Datum/Zahl</SelectLabel>
                                                        <SelectItem value="gt">Ist nach / größer als</SelectItem>
                                                        <SelectItem value="gte">Ist nach/gleich / ≥</SelectItem>
                                                        <SelectItem value="lt">Ist vor / kleiner als</SelectItem>
                                                        <SelectItem value="lte">Ist vor/gleich / ≤</SelectItem>
                                                    </SelectGroup>

                                                    {/* Optional – sehr empfehlenswert für Strings */}
                                                    <SelectGroup>
                                                        <SelectLabel>Text</SelectLabel>
                                                        <SelectItem value="contains">Enthält</SelectItem>
                                                        <SelectItem value="not_contains">Enthält nicht</SelectItem>
                                                        <SelectItem value="regex">Passt auf Regex</SelectItem>
                                                    </SelectGroup>

                                                    <SelectGroup>
                                                        <SelectLabel>Bool</SelectLabel>
                                                        <SelectItem value="is_true">Ist wahr</SelectItem>
                                                        <SelectItem value="is_false">Ist falsch</SelectItem>
                                                    </SelectGroup>

                                                    <SelectGroup>
                                                        <SelectLabel>Existenz</SelectLabel>
                                                        {/* Falls du bei Null-Prüfung bleiben willst */}
                                                        <SelectItem value="is_null">Ist null</SelectItem>
                                                        <SelectItem value="is_not_null">Ist nicht null</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors[`conditions.${index}.operator`]} />
                                        </div>

                                        <div className="w-[32%]">
                                            <div>
                                                {['equals', 'not_equals'].includes(condition.operator) && <Input value={condition.value} onChange={(e) => setConditionValue(e.target.value, index)} />}
                                                {['gt', 'gte', 'lt', 'lte'].includes(condition.operator) && <Input type="datetime-local" value={condition.value} onChange={(e) => setConditionValue(e.target.value, index)} />}
                                                {['in', 'not_in'].includes(condition.operator) && (
                                                    <Dialog key={`select_values_${condition.id}`}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="link">Werte auswählen</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                Werte auswählen
                                                            </DialogHeader>

                                                            <div>
                                                                <Button onClick={() => addConditionValue(index)} variant="link" className="px-0">
                                                                    Wert hinzufügen
                                                                </Button>
                                                            </div>

                                                            <div className="space-y-4">
                                                                {typeof condition.value === 'object' && condition.value.map((data, conditionValueIndex) => (
                                                                    <div key={data.id} className="flex items-center gap-2">
                                                                        <Input value={data.value} onChange={(e) => setConditionValue(e.target.value, index, conditionValueIndex)} />
                                                                        <Button variant="ghost" onClick={() => removeConditionValue(index, conditionValueIndex)}>
                                                                            <Trash className="text-red-500" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">
                                                                        Abbrechen
                                                                    </Button>
                                                                </DialogClose>

                                                                <Button>
                                                                    Werte speichern
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                            <InputError message={errors[`conditions.${index}.value`]} />
                                        </div>

                                        <Button onClick={() => removeRule(index)} variant="ghost" className="hover:bg-zinc-800">
                                            <Trash className="text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={close}>
                            Abbrechen
                        </Button>
                    </DialogClose>

                    <Button onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="animate-spin" />}
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

