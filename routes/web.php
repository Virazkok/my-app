    <?php

    use App\Http\Controllers\API\QrTokenController;
    use App\Http\Controllers\EskulController;
    use App\Http\Controllers\EventController;
    use App\Http\Middleware\VerifMurid;
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;
    use App\Http\Controllers\DashboardController;
    use App\Http\Controllers\ReportController;
    use App\Http\Controllers\MuridController;
    use App\Http\Controllers\AbsenController;
    use App\Http\Controllers\Admin\EskulControllerAdmin;
use App\Http\Controllers\API\ScanQRController;

    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
    });
    Route::view('/dashboard', 'app');

    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/reports', [ReportController::class, 'index'])->name('reports');
    });

    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::get('/events-dashboard', [EventController::class, 'scanPage'])->name('events.dashboard');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/murid/home', [MuridController::class, 'dashboard'])->name('murid.home');
        Route::get('/murid/home/qr/checkIn', [MuridController::class, 'index'])->name('murid.home.qr.checkIn');
        Route::get('/murid/home/qr/checkOut', [MuridController::class, 'index'])->name('murid.home.qr.checkOut');
    });

        Route::get('/murid/eskul', [EskulController::class, 'index'])->name('murid.eskul');
        Route::post('/murid/eskul/absen', [EskulController::class, 'storeAbsensi'])->name('eskul.absensi.store');

        

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/eskul/absensi', [EskulControllerAdmin::class, 'manageAbsensi'])->name('admin.eskul.absensi');
        Route::post('/eskul/absensi', [EskulControllerAdmin::class, 'storeAbsensi'])->name('admin.eskul.absensi.store');

        Route::post('/eskul/absensi/{id}/toggle-publish', [EskulControllerAdmin::class, 'togglePublish'])->name('admin.eskul.absensi.toggle-publish');
        

        Route::get('/eskul/absensi/{absensi}', [EskulControllerAdmin::class, 'detailAbsensi'])->name('admin.eskul.absensi.detail');
        Route::put('/eskul/absensi/{absensi}', [EskulControllerAdmin::class, 'update'])->name('admin.eskul.absensi.update');
        Route::delete('/eskul/absensi/{absensi}', [EskulControllerAdmin::class, 'destroy'])->name('admin.eskul.absensi.destroy');
    });
    // routes/web.php (tambahkan di bawah semua route yang sudah ada)

    // web.php
    // web.php  (tambahkan setelah route /murid/eskul)
    Route::middleware(['auth'])->group(function () {
        // Murid routes
        Route::get('/murid/events', [EventController::class, 'index'])->name('events.index');
        Route::get('/murid/events/{id}/detailEvent', [EventController::class, 'detailEvent'])
            ->name('events.event-detail');
        Route::get('/murid/events/{event}/register', [EventController::class, 'showRegistrationForm'])->name('events.register.form');
        Route::post('/murid/events/{event}/register', [EventController::class, 'register'])->name('events.register');
        // Di web.php
        Route::post('/murid/events/{event}/qr', [EventController::class, 'generateQR'])
        ->name('events.qr') // Pastikan ada nama route
        ->middleware(['web', 'auth']);
        Route::get('/murid/events/{event}/confirmation', [EventController::class, 'showConfirmation'])->name('events.confirmation');
    });

        // admin
        Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/admin/events', [EventController::class, 'manageEvents'])
            ->name('admin.events.manage');
        Route::post('/admin/events', [EventController::class, 'storeEvent'])
            ->name('admin.events.store');
        Route::patch('/admin/events/{event}/publish', [EventController::class, 'togglePublish'])
            ->name('admin.events.toggle-publish');
        Route::delete('/admin/events/{event}', [EventController::class, 'destroy'])
            ->name('admin.events.destroy');
        Route::post('/events/scan', [EventController::class, 'scanQR'])->name('events.scan');
    });


    // routes/web.php

    // Untuk peserta
    Route::get('/events/{event}', [EventController::class, 'detail'])
        ->middleware(['auth', 'verified'])
        ->name('events.detail');

    // Untuk panitia/admin
    Route::get('/events/{event}/scan', [EventController::class, 'scanPage'])
        ->middleware(['auth', 'verified', 'can:admin'])
        ->name('events.scan.page');

    Route::post('/events/scan', [EventController::class, 'scanQR'])
        ->middleware(['auth', 'verified', 'can:admin'])
        ->name('events.scan');
    require __DIR__.'/settings.php';
    require __DIR__.'/auth.php';
