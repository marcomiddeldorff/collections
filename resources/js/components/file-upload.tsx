import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';

type FileUploadProps = {
    height?: string;
    previewUrl?: string | null;
    onChange?: (file: File | undefined) => void;
    mimeTypes?: string[];
};

export default function FileUpload({ height = 'h-24', onChange, previewUrl, mimeTypes }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<string | null>(previewUrl ?? null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview((prev) => {
                if (prev) {
                    URL.revokeObjectURL(prev);
                }
                return null;
            })
        }

        onChange?.(file);
    };

    const removeImage = () => {
        setPreview(null);
        onChange?.(undefined);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className={cn('w-full rounded border border-dashed border-input py-6', height)}>
            <input accept={mimeTypes?.join(',') ?? '*'} ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />
            <div className="flex h-full items-center justify-center text-muted-foreground">
                {preview ? (
                    <div className="relative">
                        <img src={preview} width={100} height={100} alt="Preview" className="rounded-md object-cover" />

                        <button type="button" className="absolute -top-3 -right-3" onClick={removeImage}>
                            <X width={20} className="text-red-500" />
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => inputRef.current?.click()}>Klicke hier, um ein Bild hochzuladen.</button>
                )}
            </div>
        </div>
    );
}
