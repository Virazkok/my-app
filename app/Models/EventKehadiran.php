<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventKehadiran extends Model
{
    protected $table = 'event_kehadiran';

    protected $fillable = [
        'event_id',
        'event_registration_id',
        'event_attendance_id',
        'user_id',
        'attended_at',
        'scan_method',
        'status',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function registration()
    {
        return $this->belongsTo(EventRegistration::class, 'event_registration_id');
    }

    public function attendance()
    {
        return $this->belongsTo(EventAttendance::class, 'event_attendance_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
