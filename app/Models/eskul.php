<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class eskul extends Model
{
    public function siswa()
    {
        return $this->belongsToMany(User::class, 'eskul_siswa');
    }

    public function absensi()
    {
        return $this->hasMany(AbsensiEskul::class);
    }
}
