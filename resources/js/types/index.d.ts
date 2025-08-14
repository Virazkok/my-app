import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { User } from "./user";
import { Event, EventRegistration } from "./event";

export interface PageProps {
    auth: {
        user: User;
    };
    event?: Event;
    registration?: EventRegistration;
    lastScanned?: {
        name: string;
        event: string;
        time: string;
    };
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
// resources/js/types.ts

export interface Student {
    kelas: any;
    scanned_at: string;
    id: number;
    nis: string;
    nama: string;
    class_id: number;
    qr_token: string;
    kelas_id: {
    name: string;
    };
    scanned_at?: string;
    created_at: string;
    updated_at: string;
}

export interface kelas {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface eskul {
    id: number;
    nama: string;
    deskripsi: string;
    created_at: string;
    updated_at: string;
}

export interface Attendance {
    kehadiran: string;
    jam_masuk: ReactNode;
    tanggal: ReactNode;
    kelas: any;
    murid: any;
    id: number;
    student_id: number;
    class_id: number;
    date: string;
    time_in: string;
    status: 'present' | 'late' | 'absent';
    created_at: string;
    updated_at: string;
    student?: any;
    class_room?: ClassRoom;
}

export interface ScanResponse {
    message: string;
    student: Student;
    attendance: Attendance;
}

export interface QrResponse {
    qr_code: string;
    expires_in: number;
}

export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    students?: Student[];
    attendances?: Attendance[];
    classAttendances?: Record<string, Attendance[]>;
    kelasList?: kelas[]; // tambahkan ini
}

export interface ApiError {
    message?: string;
    error?: string;
    [key: string]: any;
}

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}