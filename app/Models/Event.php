<?php

// app/Models/Event.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    // app/Models/Event.php
    use SoftDeletes;
protected $fillable = [
    'title',
    'description',
    'type',
    'start_date',
    'end_date',
    'sport_categories',
    'is_published',
    'team_required_sports',  // new
    'team_size',             // new
];

protected $casts = [
    'sport_categories'      => 'array',
    'team_required_sports'  => 'array',
    'team_size'             => 'array',
    'start_date' => 'datetime',
    'end_date' => 'datetime',
    'is_published' => 'boolean'
];
    public function getIsSportAttribute(): bool
{
    return $this->type === 'olahraga';
}

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function attendances()
    {
        return $this->hasMany(EventAttendance::class);
    }
}
