<?php
/*
 * @author Marco Middeldorff <nc-middelma@gmx.de>
 */

namespace App\Shared;

class Notify
{
    public static function success(string $message): void
    {
        session()->flash('notification', [
            'type' => 'success',
            'message' => $message,
        ]);
    }

    public static function error(string $message): void
    {
        session()->flash('notification', [
            'type' => 'error',
            'message' => $message,
        ]);
    }

    public static function info(string $message): void
    {
        session()->flash('notification', [
            'type' => 'info',
            'message' => $message,
        ]);
    }

    public static function warning(string $message): void
    {
        session()->flash('notification', [
            'type' => 'warning',
            'message' => $message,
        ]);
    }
}
