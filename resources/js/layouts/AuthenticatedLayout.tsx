// resources/js/Layouts/AuthenticatedLayout.tsx
import React, { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';

interface AuthenticatedLayoutProps {
    user: {
        name: string;
        email: string;
    };
    header?: ReactNode;
    children: ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ user, header, children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Absensi Sekolah</title>
                <meta name="description" content="Sistem Absensi Sekolah" />
            </Head>

            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/dashboard">
                                    <span className="text-xl font-bold text-gray-800">Absensi Sekolah</span>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="ml-3 relative">
                                <span className="text-gray-500">{user.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
};

export default AuthenticatedLayout;