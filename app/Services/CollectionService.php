<?php

/*
 * @author Marco Middeldorff <nc-middelma@gmx.de>
 */

namespace App\Services;

use App\Models\Collection;
use App\Repositories\CollectionRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CollectionService
{
    public function __construct(
        public CollectionRepository $collectionRepository,
    ) {}

    public function storeCollection(array $data): void
    {
        // A thumbnail has been uploaded.
        if (isset($data['thumbnail'])) {
            $data['thumbnail_path'] = $this->storeThumbnailOnFileSystem($data['thumbnail']);
        }

        $this->collectionRepository->store(array_merge($data, [
            'user_id' => auth()->id(),
        ]));
    }

    public function updateCollection(Collection $collection, array $data): void
    {
        if (! isset($data['thumbnail'])) {
            $data['thumbnail_path'] = null;
            $this->deleteThumbnailFromFileSystem($collection->thumbnail_path);
        } else {
            // The thumbnail has been changed / A new file has been uploaded.
            if ($data['thumbnail'] instanceof UploadedFile) {
                $this->deleteThumbnailFromFileSystem($collection->thumbnail_path);
                $data['thumbnail_path'] = $this->storeThumbnailOnFileSystem($data['thumbnail']);
            }
        }

        $this->collectionRepository->update($collection, $data);
    }

    public function deleteCollection(Collection $collection): void
    {
        // Delete the thumbnail from the file system if it exists.
        if ($collection->thumbnail_path) {
            $this->deleteThumbnailFromFileSystem($collection->thumbnail_path);
        }

        $this->collectionRepository->delete($collection);
    }

    protected function deleteThumbnailFromFileSystem(?string $thumbnailPath): void
    {
        if (! $thumbnailPath) {
            return;
        }

        if (Storage::disk('public')->exists($thumbnailPath)) {
            Storage::disk('public')->delete($thumbnailPath);
        }
    }

    /**
     * Store the thumbnail on the file system.
     *
     * @return string The new file name of the stored thumbnail.
     */
    protected function storeThumbnailOnFileSystem(UploadedFile $thumbnail): string
    {
        $newFilename = microtime(true).'.'.$thumbnail->getClientOriginalExtension();

        $storage = Storage::disk('public');

        // Create the thumbnails directory if it does not exist.s
        if (! $storage->exists('thumbnails')) {
            $storage->makeDirectory('thumbnails');
        }

        $thumbnail->storePubliclyAs('thumbnails', $newFilename, [
            'disk' => 'public',
        ]);

        return '/thumbnails/'.$newFilename;
    }
}
