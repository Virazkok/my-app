import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    kelas_id: string;
    nis: string;
    eskul_siswa1_id: string;
    eskul_siswa2_id: string;
    eskul_siswa3_id: string;
};

interface Kelas {
    id: string;
    name: string;
}

// Definisikan tipe untuk eskul
interface Eskul {
    id: string;
    nama: string;
}

export default function Register() {
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Perbaikan: Beri tipe untuk eskulOptions
    const [eskulOptions, setEskulOptions] = useState<Eskul[]>([]);
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        kelas_id: '',
        nis: '',
        eskul_siswa1_id: '',
        eskul_siswa2_id: '',
        eskul_siswa3_id: ''
    });

    useEffect(() => {
        // Fetch kelas dari API
        fetch('/api/kelas')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setKelasList(data);
            })
            .catch(error => {
                console.error('Error fetching kelas:', error);
            });

        // Perbaikan: Fetch data eskul dari API
        fetch('/api/eskul') // Ganti dengan endpoint yang sesuai
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setEskulOptions(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching eskul:', error);
                setIsLoading(false);
            });
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="nis">Nis</Label>
                        <Input
                            id="nis"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="nis"
                            value={data.nis}
                            onChange={(e) => setData('nis', e.target.value)}
                            disabled={processing}
                            placeholder="Nomor Induk Sekolah"
                        />
                        <InputError message={errors.nis}  />
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="kelas_id">Kelas</Label>
                        <Select
                            value={data.kelas_id?.toString() ?? ""}
                            onValueChange={(value) => setData('kelas_id', value)}
                            disabled={processing || isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={
                                    isLoading ? "Memuat data kelas..." : "Pilih kelas"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading ? (
                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                        Memuat data kelas...
                                    </div>
                                ) : (
                                    kelasList.map((kelas) => (
                                        <SelectItem key={kelas.id} value={kelas.id.toString()}>
                                            {kelas.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.kelas_id} />
                    </div>
                    
                    {/* Dropdown untuk eskul */}
                    <div className="grid gap-2">
                        <Label>Eskul 1 (Opsional)</Label>
                        <select
                            value={data.eskul_siswa1_id}
                            onChange={(e) => setData('eskul_siswa1_id', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            disabled={processing || isLoading}
                        >
                            <option value="">Pilih Eskul</option>
                            {eskulOptions.map(eskul => (
                                <option key={eskul.id} value={eskul.id}>{eskul.nama}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Eskul 2 (Opsional)</Label>
                        <select
                            value={data.eskul_siswa2_id}
                            onChange={(e) => setData('eskul_siswa2_id', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            disabled={processing || isLoading}
                        >
                            <option value="">Pilih Eskul</option>
                            {eskulOptions.map(eskul => (
                                <option key={eskul.id} value={eskul.id}>{eskul.nama}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Eskul 3 (Opsional)</Label>
                        <select
                            value={data.eskul_siswa3_id}
                            onChange={(e) => setData('eskul_siswa3_id', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            disabled={processing || isLoading}
                        >
                            <option value="">Pilih Eskul</option>
                            {eskulOptions.map(eskul => (
                                <option key={eskul.id} value={eskul.id}>{eskul.nama}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}