<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventAttendance;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;
use Inertia\Response;

class EventController extends Controller
{
    // EventController@index
public function index(Request $request)
{
    $events = Event::with(['registrations' => fn($q) =>
                $q->where('user_id', $request->user()->id)
              ])
              ->where('is_published', true)
              ->get();   // <- JANGAN pakai ->only(...)

    return inertia('Event/MuridEvent', [
        'events' => $events,
        'auth'   => ['user' => $request->user()->only('id','name','email')],
    ]);
}

    public function store(Request $request)
{
    $validated = $request->validate([
        'title'                 => 'required|string|max:255',
        'description'           => 'required|string',
        'type'                  => 'required|in:olahraga,non-olahraga,pemberitahuan',
        'start_date'            => 'required|date',
        'end_date'              => 'required|date|after:start_date',
        'sport_categories'      => 'nullable|array',
        'sport_categories.*'    => 'string',
        'team_required_sports'  => 'nullable|array',
        'team_required_sports.*'=> 'string',
        'team_size'             => 'nullable|array',
        'team_size.*'           => 'integer|min:1',
        'is_published'          => 'boolean',
    ]);

   // Konversi ke WIB sebelum menyimpan
    $validated['start_date'] = Carbon::parse($validated['start_date']); 
    $validated['end_date']   = Carbon::parse($validated['end_date']);

    Event::create($validated);

    return redirect()->back()->with('success', 'Event created');
}

    public function register(Request $request)
{
    $validated = $request->validate([
        'sport_category' => 'required_if:event.type,olahraga',
        'team_members'   => 'nullable|array',
    ]);

    $event = Event::findOrFail($request->event);

    if (!$event->is_published) {
        return response()->json(['message' => 'Event belum dipublish, tidak bisa mendaftar'], 403);
    }

    $qrToken = Str::random(32);

    $registration = EventRegistration::updateOrCreate(
        [
            'event_id' => $event->id,
            'user_id'  => $request->user()->id
        ],
        array_merge($validated, [
            'qr_token' => $qrToken,
        ])
    );

    return response()->json([
        'message' => 'Pendaftaran berhasil',
        'registration' => $registration
    ]);
}


    public function generateQr(Request $request, $eventId)
{
    $user = Auth::user();

    $registration = EventRegistration::where('event_id', $eventId)
        ->where('user_id', $user->id)
        ->firstOrFail();

    // Token selalu baru
    $registration->qr_token = Str::random(32);
    $registration->save();

    $payload = json_encode([
        'token'   => $registration->qr_token,
        'user_id' => $registration->user_id,
    ]);

    $qrSvg = (string) QrCode::size(300)->generate($payload);

    return response()->json([
        'props' => [
            'qr_code' => $qrSvg,
            'error'   => false
        ]
    ]);
}

 public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('admin.events.manage')->with('success', 'Event dihapus');
    }

    public function updatePublishStatus(Request $request, $eventId)
    {
        $request->validate(['is_published' => 'required|boolean']);
        
        $event = Event::findOrFail($eventId);
        $event->update(['is_published' => $request->is_published]);
        
        return response()->json($event);
    }
    // app/Http/Controllers/EventController.php
    // EventController
public function manageEvents()
{
    $events = Event::latest()->get();
    return inertia('Admin/AdminEvent', ['events' => $events]);
}

// EventController
public function storeEvent(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'type' => 'required|in:olahraga,non-olahraga,pemberitahuan',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
        'sport_categories' => 'nullable|array',
        'is_published' => 'boolean',
    ]);

    Event::create($validated);

    return redirect()->route('admin.events.manage')->with('success', 'Event berhasil dibuat');
}
public function togglePublish(Request $request, $eventId)
{
    $event = Event::findOrFail($eventId);

    $event->update([
        'is_published' => !$event->is_published,
    ]);

    return redirect()->route('admin.events.manage')->with('success', 'Status publish berhasil diubah');
}

public function detailEvent($id)
{
    $event = Event::findOrFail($id);
    $reg = $event->registrations()
                 ->where('user_id', auth()->id())
                 ->with('user.kelas')
                 ->first();

    return inertia('Event/EventDetail', [
        'event' => $event,
        'registration' => $reg,
    ]);
}
// Add these methods to your existing EventController

public function showRegistrationForm(Event $event)
{
    if (!$event->is_published) {
        abort(403, 'Event belum dipublish');
    }

    // Load user dengan relasi yang diperlukan
    $user = auth()->user()->load(['kelas', 'murid.kelas']);

    if (!$user->kelas && !optional($user->murid)->kelas) {
        return redirect()->back()->with('error', 'Data kelas tidak ditemukan');
    }

    return inertia('Event/EventRegister', [
        'event' => $event,
        'auth' => [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'kelas' => $user->kelas ?? optional($user->murid)->kelas
            ]
        ],
    ]);
}


public function showConfirmation(Event $event)
{
    $registration = $event->registrations()
        ->where('user_id', auth()->id())
        ->with('user.murid.kelas')
        ->firstOrFail();

    // ASUSMSI data di database sudah WIB, langsung parse tanpa konversi
    $startDate = Carbon::parse($event->start_date);
    $endDate = Carbon::parse($event->end_date);
    
    // Validasi waktu dalam WIB
    $canGenerateQR = Carbon::now('Asia/Jakarta')->between($startDate, $endDate);

    return inertia('Event/EventConfirmation', [
        'event' => array_merge($event->toArray(), [
            'start_date' => $startDate->format('Y-m-d H:i:s'),
            'end_date' => $endDate->format('Y-m-d H:i:s'),
            // Tambahkan waktu dalam format ISO tanpa timezone
            'start_date_plain' => $startDate->format('Y-m-d\TH:i'),
            'end_date_plain' => $endDate->format('Y-m-d\TH:i')
        ]),
        'registration' => $registration,
        'canGenerateQR' => $canGenerateQR,
        'qrMessage' => !$canGenerateQR 
            ? ($startDate->isFuture() 
                ? 'QR code akan tersedia mulai ' . $startDate->format('d M Y H:i')
                : 'Event telah berakhir')
            : null,
    ]);
}

public function scanPage(): Response
    {
        // Kalau mau kirim data ke halaman scanner, taruh di sini
        // Misalnya list event, atau event aktif sekarang
        $events = Event::latest()->get();

        return Inertia::render('Admin/EventScanner', [
            'events' => $events
        ]);
    }
}