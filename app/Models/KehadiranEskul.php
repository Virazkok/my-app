<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KehadiranEskul extends Model
{
    public function absensi()
    {
        return $this->belongsTo(AbsensiEskul::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // app/Models/KehadiranEskul.php
protected $fillable = [
    'absensi_eskul_id',
    'user_id',
    'foto_path',
    'status',
    'waktu_absen'
];
}
