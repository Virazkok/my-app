<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\EventRegistration;
use App\Models\Murid;
use App\Models\Kehadiran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use illuminate\Support\Facades\Log;

class ScanQRController extends Controller
{
public function scan(Request $request)
{
    try {
        $data = $request->input('qr_data');

        if (!is_array($data) || !isset($data['token']) || !isset($data['murid_id'])) {
            return response()->json(['message' => 'Format QR tidak valid.'], 400);
        }

        $murid = Murid::with('kelas')
            ->where('id', $data['murid_id'])
            ->where('qr_token', $data['token'])
            ->first();

        if (empty($murid->token_expired_at)) {
    return response()->json(['message' => 'QR code belum memiliki masa berlaku.'], 400);
}

        if (now()->greaterThan($murid->token_expired_at)) {
    return response()->json(['message' => 'Token QR sudah kadaluarsa.'], 410);
}


        $sudahAbsen = Kehadiran::where('murid_id', $murid->id)
            ->whereDate('tanggal', now())
            ->exists();

        if ($sudahAbsen) {
            return response()->json([
                'message' => 'Murid sudah absen hari ini.',
                'student' => $murid,
            ]);
        }

        Kehadiran::create([
            'murid_id'   => $murid->id,
            'kelas_id'   => $murid->kelas_id,
            'tanggal'    => now()->toDateString(),
            'jam_masuk'  => now()->toTimeString(),
            'kehadiran'  => 'hadir',
        ]);

        return response()->json([
            'message' => 'Absensi berhasil dicatat!',
            'student' => $murid,
        ]);

    } catch (\Exception $e) {
        // Log error agar kamu bisa lihat detailnya
        Log::error('Scan QR error: '.$e->getMessage());

        return response()->json([
            'message' => 'Terjadi kesalahan saat mencatat kehadiran.',
            'error' => $e->getMessage()
        ], 500);
    }
}

 public function scanEvent(Request $request)
{
    $data = $request->input('qr_data');

    // Pastikan QR punya event_id & token
    if (!isset($data['event_id']) || !isset($data['token'])) {
        return response()->json(['message' => 'Format QR tidak valid'], 400);
    }

    // Ambil event berdasarkan event_id dari QR
    $event = Event::find($data['event_id']);
    if (!$event) {
        return response()->json(['message' => 'Event tidak ditemukan'], 404);
    }

    // 🔹 Hapus validasi strict token agar bisa scan banyak event
    // (opsional: tetap cek kalau mau minimal validasi keamanan)
    // if ($event->qr_token !== $data['token']) {
    //     return response()->json(['message' => 'Token QR tidak valid'], 400);
    // }

    // Cari registrasi user berdasarkan user_id (atau registration_id kalau mau)
    $registration = EventRegistration::where('event_id', $event->id)
        ->where('user_id', $data['user_id'] ?? null)
        ->first();

    if (!$registration) {
        return response()->json(['message' => 'Peserta tidak ditemukan'], 404);
    }

    // Catat kehadiran
    EventAttendance::updateOrCreate(
        ['registration_id' => $registration->id],
        [
            'event_id'    => $event->id,
            'murid_id'    => $registration->murid_id ?? null,
            'attended_at' => now(),
        ]
    );

    return response()->json([
        'message'      => 'Kehadiran berhasil dicatat',
        'registration' => $registration,
        'event'        => $event
    ]);
}

}