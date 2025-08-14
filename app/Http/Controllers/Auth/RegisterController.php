<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Murid;

class RegisterController
{
    public function __construct()
    {
        // Di Laravel 11+, middleware didefinisikan di routes
    }

    public function show(Request $request)
    {
        return view('auth.register', [
            'kelas' => Kelas::all()
        ]);
    }

    public function store(Request $request)
    {
    $validated = $request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|string|email|max:255|unique:users',
    'password' => 'required|string|min:8|confirmed',
    'kelas_id' => 'required|exists:kelas,id',
    'nis' => 'required|string|max:255|unique:users,nis',
    'eskul_siswa1_id' => ['nullable', 'exists:eskuls,id'],
    'eskul_siswa2_id' => ['nullable', 'exists:eskuls,id'],
    'eskul_siswa3_id' => ['nullable', 'exists:eskuls,id'],
]);



$user = User::create([
    'name' => $validated['name'],
    'email' => $validated['email'],
    'password' => Hash::make($validated['password']),
    'kelas_id' => $validated['kelas_id'],
    'eskul_siswa1_id' => $data['eskul_siswa1_id'] ?? null,
    'eskul_siswa2_id' => $data['eskul_siswa2_id'] ?? null,
    'eskul_siswa3_id' => $data['eskul_siswa3_id'] ?? null,
    'nis' => $validated['nis'],
    'role' => 'murid',
]);

$murid = Murid::create([
    'user_id' => $user->id,
    'nis' => $validated['nis'],
    'nama' => $validated['name'], // gunakan name, bukan nama
    'kelas_id' => $validated['kelas_id'],
    'qr_token' => null,
]);


auth()->login($user);


return redirect('/');
    }
}