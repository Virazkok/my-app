<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kehadiran extends Model
{
    protected $table = "kehadiran";
    protected $fillable = ['murid_id', 'kelas_id', 'tanggal', 'jam_masuk', 'kehadiran'];

    public function murid()
{
    return $this->belongsTo(Murid::class);
}
public function kelas()
{
    return $this->belongsTo(Kelas::class);
}

}
