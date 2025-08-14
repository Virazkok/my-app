import { useEffect, useState } from 'react';
import BottomNavbar from '@/components/Murid/BottomNavbar';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { PageProps } from '@/types';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000'; // Ensure this URL is correct and accessible

const QRCheckInOut = ({ mode = 'in' }) => {
    const [user, setUser] = useState({ nama: '', avatar: '' });
    const [scanned, setScanned] = useState(false);
    const [time, setTime] = useState('');
    const [qrCode, setQrCode] = useState<string>('');
    const [countdown, setCount] = useState(20);

    const fetchQrCode = () => {
        router.reload({
            only: ['qrCode'],
            onSuccess: page => {
                const props = page.props as unknown as PageProps & { qrCode: string };
                setQrCode(props.qrCode);
                setCount(20);
            },
            onError: () => console.error('gagal fetch QR'),
        });
    };

    useEffect(() => {
        // Fetch QR code immediately when the component mounts
        fetchQrCode();

        let tick: NodeJS.Timeout;
        let fetch: NodeJS.Timeout;

        const loop = () => {
            // Fetch new QR every 20 seconds
            fetch = setInterval(() => {
                fetchQrCode();
            }, 20000);

            // Update countdown every second
            tick = setInterval(() => {
                setCount((c) => {
                    if (c === 0) {
                        return 20; // Reset to 20 seconds
                    }
                    return c - 1;
                });
            }, 1000);
        };

        loop();
        return () => {
            clearInterval(tick);
            clearInterval(fetch);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white px-4">
            <h2 className="text-2xl font-bold text-center mt-4">
                {mode === 'in' ? 'Check In' : 'Check Out'}
            </h2>

            <div className="flex-1 flex items-center justify-center">
                <div className="bg-gray-100 rounded-2xl shadow-md p-4 w-full max-w-sm text-center">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-left">
                            <h3 className="text-lg font-semibold">{user.nama}</h3>
                            {scanned && (
                                <p className="text-sm text-gray-600">
                                    Hari ini, {mode === 'in' ? 'check in' : 'check out'} jam {time}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border-4 border-[#C0C0C0] relative mb-2 margin-10px">
                        {qrCode ? (
                            <div
                                className="flex justify-center"
                                key={qrCode}
                                dangerouslySetInnerHTML={{ __html: qrCode }}
                            />
                        ) : (
                            <p className="text-center text-red-500">QR Code tidak tersedia</p>
                        )}
                    </div>

                    <p className="mt-2 text-center font-bold text-indigo-600">
                        Refreshing in {countdown}s
                    </p>
                    <p className="mt-1 text-center text-sm text-gray-600">
                        Tunjukkan QR Code ini saat absensi
                    </p>
                </div>
            </div>

            <BottomNavbar />
        </div>
    );
};

export default QRCheckInOut;