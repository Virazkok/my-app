<?php

use App\Http\Controllers\API\ScanQRController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MuridController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AttendanceController;
use App\Http\Controllers\API\QrTokenController;
use App\Models\Murid;

Route::post('/events/scan-qr', [ScanQRController::class, 'scanEvent'])
    ->name('events.scan-qr');
Route::post('/scan-qr', [ScanQrController::class, 'scan']);
Route::middleware(['auth', 'verified'])
     ->get('/generate-qr', [MuridController::class, 'generateQrCode']);
    // Route untuk mendapatkan data
    Route::get('/murid', function () {
        return Murid::with('kelas')->get();
    });
    
    Route::get('/kehadiran', function () {
        return \App\Models\Kehadiran::with(['murid', 'kelas'])->get();
    });
    
    Route::get('/class-attendances/{classId}', function ($classId) {
        return \App\Models\Kehadiran::with('murid')
            ->where('kelas_id', $classId)
            ->get();
    });
    Route::get('/kelas', function() {
    return \App\Models\Kelas::all(); // Ganti dengan model Kelas Anda
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::post('/events/register', [EventController::class, 'register']);
    Route::post('/events/{id}/generate-qr', [EventController::class, 'generateQR']);
    Route::post('/events/{id}/publish', [EventController::class, 'updatePublishStatus']);
    Route::get('/event-registrations', function (Request $request) {
    return $request->user()->eventRegistrations;
    });
});
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::patch('/events/{id}/publish', [EventController::class, 'updatePublishStatus']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// routes/api.php
Route::get('/eskuls', function() {
    return \App\Models\Eskul::all();
});
