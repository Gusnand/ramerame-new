import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

type Product = {
    id: number;
    product_name: string;
    product_slug: string;
    status: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios.get('/products/data').then((response) => {
            setProducts(response.data.data);
        });
    }, []);

    const detailProduct = () => {
        // masuk ke halaman form detail produk
        // di sini user bisa ngedit produknya juga
        router.get('/project');
    };

    const deleteProduct = () => {
        // hapus produk langsung ke db juga
    };

    const viewBenefit = () => {
        // masuk ke halaman benefit dari produknya
        // ini tampilannya halaman kalender yg isi jumlah keuntungan, bisa diswitch daily atau monthly
    };

    // const columns = [
    //     {
    //         name: 'ID',
    //         selector: (row: Product) => row.id,
    //         sortable: true,
    //     },
    //     {
    //         name: 'Nama Produk',
    //         selector: (row: Product) => row.product_name,
    //         sortable: true,
    //     },
    //     {
    //         name: 'Deskripsi',
    //         selector: (row: Product) => row.product_slug,
    //         sortable: true,
    //     },
    //     // Tambahkan kolom lain sesuai kebutuhan
    // ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1>Daftar Produk</h1>
                <Table>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[50px]">ID</TableHead>
                            <TableHead className="w-[300px]">Nama Produk</TableHead>
                            <TableHead className="w-[500px]">Deskripsi</TableHead>
                            <TableHead className="w-[100] text-right">Status</TableHead>
                            <TableHead className="w-[100] text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="">{product.id}</TableCell>
                                <TableCell>{product.product_name}</TableCell>
                                <TableCell className="truncate">{product.product_slug}</TableCell>
                                <TableCell className="text-right">{product.status}</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="link" className="" onClick={detailProduct}>
                                        <Pencil />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* <DataTable columns={columns} data={products} pagination /> */}

                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div> */}
            </div>
        </AppLayout>
    );
}
