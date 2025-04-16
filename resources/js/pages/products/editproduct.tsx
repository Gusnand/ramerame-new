import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function EditProduct() {
    return (
        <AppLayout>
            <Head title="Edit Produk" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>Form Edit Produk ada Di SIni</div>
            </div>
        </AppLayout>
    );
}
