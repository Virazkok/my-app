<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsensiEskul extends Model
{
    /**
     * 
     *
     * @var array<string>
     */
    protected $fillable = [
        'eskul_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'dipublish',
    ];

    public function eskul()
    {
        return $this->belongsTo(Eskul::class);
    }

    // app/Models/AbsensiEskul.php
public function kehadiran()
{
    return $this->hasMany(KehadiranEskul::class, 'absensi_eskul_id');
}
    // app/Models/AbsensiEskul.php
protected $casts = [
    'tanggal'   => 'date:Y-m-d',
    'dipublish' => 'boolean',
];

// controller
public function detailAbsensi(AbsensiEskul $absensi)
{
    $absensi->load('eskul:id,nama', 'kehadiran.user');
    return inertia('Admin/DetailAbsensi', [
        'absensi' => $absensi,
    ]);
}
}