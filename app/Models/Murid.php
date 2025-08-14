<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Kelas;

class Murid extends Model
{
    protected $table = "murid";
    protected $fillable = ['nis', 'nama', 'kelas_id', 'qr_token', 'token_expired_at'];

public function kelas()
{
    return $this->belongsTo(Kelas::class, 'kelas_id');
}
public function user()
{
    return $this->belongsTo(User::class);
}



    public function attendances()
    {
        return $this->hasMany(Kehadiran::class);
    }
}
