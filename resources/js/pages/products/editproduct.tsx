import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type Category = {
    id: number;
    category_name: string;
};

export default function EditProduct({ product, categories }: { product: any; categories: Category[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit Produk',
            href: `/products/editproduct/${product.id}`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: product.product_name,
        category: product.product_category_id,
        short_content: product.product_slug,
        content: product.content,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        put(`/products/update/${product.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Produk" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">Nama Produk</Label>
                        <Input type="text" id="name" placeholder="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    {/* <div>
                        <label className="mb-1 block">Nama Produk</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div> */}

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="category">Kategori</Label>
                        <Select value={String(data.category)} onValueChange={(value) => setData('category', Number(value))}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Pilih Kategori Produk" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.category_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500">{errors.category}</p>}
                    </div>

                    {/* <Select>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Pilih Kategori Produk" />
                            </SelectTrigger>
                            <SelectContent onChange={(e) => setData('category', Number((e.target as HTMLInputElement).value))}>
                                <SelectItem value={data.category}>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </SelectItem>
                            </SelectContent>
                        </Select> */}
                    {/* <select
                            className="w-full rounded border px-3 py-2"
                            value={data.category}
                            onChange={(e) => setData('category', Number(e.target.value))}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select> */}
                    {/* <input
                            type="number"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        /> */}

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">Deskripsi Pendek</Label>
                        <Input
                            type="text"
                            id="short_content"
                            placeholder="Masukan deskripsi pendek"
                            value={data.short_content}
                            onChange={(e) => setData('short_content', e.target.value)}
                        />
                        {errors.short_content && <p className="text-red-500">{errors.short_content}</p>}
                    </div>
                    {/* <div>
                        <label className="mb-1 block">Deskripsi Pendek</label>
                        <input
                            type="text"
                            value={data.short_content}
                            onChange={(e) => setData('short_content', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.short_content && <p className="text-red-500">{errors.short_content}</p>}
                    </div> */}
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">Deskripsi Panjang</Label>
                        <Input
                            type="text"
                            id="content"
                            placeholder="Masukan deskripsi pendek"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                        />
                        {errors.content && <p className="text-red-500">{errors.content}</p>}
                    </div>
                    {/* <div>
                        <label className="mb-1 block">Deskripsi Panjang</label>
                        <input
                            type="text"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.content && <p className="text-red-500">{errors.content}</p>}
                    </div> */}

                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white" disabled={processing}>
                        Simpan Perubahan
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
