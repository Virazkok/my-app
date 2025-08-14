<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'kelas_id',
        'nis',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }
    public function murid()
    {
        return $this->hasOne(\App\Models\Murid::class, 'user_id');
    }
// app/Models/User.php
// di User.php
public function getEskulAttribute()
{
    $ids = array_filter([
        $this->eskul_siswa1_id,
        $this->eskul_siswa2_id,
        $this->eskul_siswa3_id,
    ]);

    return \App\Models\Eskul::whereIn('id', $ids)->get();
}

public function eskul1()
{
    return $this->belongsTo(Eskul::class, 'eskul_siswa1_id');
}

public function eskul2()
{
    return $this->belongsTo(Eskul::class, 'eskul_siswa2_id');
}

public function eskul3()
{
    return $this->belongsTo(Eskul::class, 'eskul_siswa3_id');
}
public function eventRegistrations()
{
    return $this->hasMany(EventRegistration::class);
}

public function eventAttendances()
{
    return $this->hasMany(EventAttendance::class);
}
   
}
