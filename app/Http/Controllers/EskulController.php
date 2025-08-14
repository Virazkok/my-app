<?php

// app/Http/Controllers/EskulController.php
namespace App\Http\Controllers;

use App\Models\AbsensiEskul;
use App\Models\KehadiranEskul;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EskulController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $eskul = $user->eskul;
        $hariIni = now()->format('Y-m-d');

        // semua eskul
        // $eskul = \App\Models\Eskul::all();               
        // $absensiHariIni = \App\Models\AbsensiEskul::with(['kehadiran' => fn($q) => $q->where('user_id', $user->id)])
        //     ->where('tanggal', $hariIni)
        //     ->where('dipublish', true)
        //     ->get();
        
        // eskul yang diminati
        $absensiHariIni = AbsensiEskul::with(['kehadiran' => function($query) use ($user) {
            $query->where('user_id', $user->id);
            }])
            ->whereIn('eskul_id', $eskul->pluck('id'))
            ->where('tanggal', $hariIni)
            ->where('dipublish', true)
            ->get();

        return inertia('Eskul/AbsensiEskul', [
            'eskul' => $eskul,
            'absensiHariIni' => $absensiHariIni
        ]);
    }

    public function storeAbsensi(Request $request)
    {
        $request->validate([
        'absensi_eskul_id' => 'required|exists:absensi_eskuls,id',
        'foto' => 'required|image|max:2048'
    ]);

    $absensi = AbsensiEskul::findOrFail($request->absensi_eskul_id);

    if ($absensi->kehadiran()->where('user_id', Auth::id())->exists()) {
        return back()->with('error', 'Anda sudah melakukan absen untuk sesi ini');
    }

    // 1. simpan foto ke disk "public"
    $path = $request->file('foto')->store('absensi_eskul', 'public');

    // 2. catat kehadiran
    KehadiranEskul::create([
        'absensi_eskul_id' => $absensi->id,
        'user_id'          => Auth::id(),
        'foto_path'        => $path,   // <- simpan path saja
        'status'           => 'hadir',
    ]);

    return back()->with('success', 'Absensi berhasil dicatat');
    }
}
