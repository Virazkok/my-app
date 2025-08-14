<?php

// app/Http/Controllers/Admin/EskulController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbsensiEskul;
use App\Models\Eskul;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EskulControllerAdmin extends Controller
{
    public function manageAbsensi()
    {
        $eskul = Eskul::all();
        $absensi = AbsensiEskul::with('eskul')->latest()->get();
        
        return inertia('Admin/AdminDashboard', [
            'eskul' => $eskul,
            'absensi' => $absensi
        ]);
    }

    public function storeAbsensi(Request $request)
    {
        $request->validate([
            'eskul_id' => 'required|exists:eskuls,id',
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'dipublish' => 'boolean'
        ]);

        AbsensiEskul::create([
            'eskul_id' => $request->eskul_id,
            'tanggal' => $request->tanggal,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'dipublish' => $request->dipublish ?? false
        ]);

        return back()->with('success', 'Jadwal absensi berhasil dibuat');
    }

    public function togglePublish($id)
    {
        $absensi = AbsensiEskul::findOrFail($id);
        $absensi->update([
            'dipublish' => !$absensi->dipublish
        ]);

        return back()->with('success', 'Status publish berhasil diubah');
    }

    public function detailAbsensi(AbsensiEskul $absensi)
{
    $absensi->load('eskul', 'kehadiran.user');
    
    return inertia('Admin/DetailAbsensi', [
        'absensi' => $absensi,
        'kehadiran' => $absensi->kehadiran->map(fn($k) => [
            'id' => $k->id,
            'user' => $k->user->only('id', 'name'),
            'foto_url' => Storage::url($k->foto_path),
            'created_at' => $k->created_at->toDateTimeString(),
        ]),
    ]);
}

public function update(Request $request, AbsensiEskul $absensi)
{
    $request->validate([
        'tanggal'     => 'required|date',
        'jam_mulai'   => 'required|date_format:H:i',
        'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
    ]);
    $absensi->update($request->only(['tanggal', 'jam_mulai', 'jam_selesai']));
    return redirect()->route('admin.eskul.absensi.detail', $absensi)
                     ->with('success', 'Jadwal berhasil diperbarui.');
}

public function destroy(AbsensiEskul $absensi)
{
    $absensi->kehadiran()->delete(); // optional cascade
    $absensi->delete();
    return redirect()->route('admin.eskul.absensi')
                     ->with('success', 'Absensi dihapus.');
}
}
