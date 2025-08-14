<?php

namespace App\Http\Controllers;

use App\Models\Murid;
use Inertia\Inertia;
use App\Models\Kelas;

class DashboardController extends Controller
{
    public function index()
    {
        $students = Murid::with('kelas')->get(); // hanya sekali ambil data murid + relasi kelas
        $kelaslist = Kelas::all();

       return Inertia::render('dashboard', [
        'students' => Murid::with('kelas')->get(),
        'kelasList' => Kelas::all(),
    ]);

    }
}
