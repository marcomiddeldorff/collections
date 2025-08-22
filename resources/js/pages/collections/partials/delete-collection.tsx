import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collection } from '@/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

type DeleteCollectionProps = {
    collection: Collection;
};

export default function DeleteCollection({ collection }: DeleteCollectionProps) {

    const submit = () => {
        router.delete(route('collections.destroy', collection.id), {
            onSuccess: () => {
                toast.success("Die Sammlung wurde erfolgreich gelöscht.")
            }
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" variant="destructive">
                    Löschen
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bist du dir sicher, dass du die Sammlung "{collection.name}" löschen möchtest?</DialogTitle>
                    <DialogDescription>
                        Bitte beachte, dass sämtliche Inhalte deiner Sammlung unwiderruflich gelöscht werden. Eine Wiederherstellung ist nach dem
                        Löschvorgang nicht länger möglich.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            Abbrechen
                        </Button>
                    </DialogClose>
                    <Button onClick={submit} variant="destructive">
                        Sammlung löschen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
