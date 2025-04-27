import HeadingSmall from '@/components/heading-small';
import RichTextEditor from '@/components/richtext-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { Head, router, useForm } from '@inertiajs/react';

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
    term: product.term,
    status: product.status,
    expired_date: product.expired_date,
    invest_month: product.invest_month,
    account_no: product.account_no,
    on_behalf_of: product.on_behalf_of,
    bank_id: product.bank_id,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    put(`/products/update/${product.id}`);
  };

  const returnPage = () => {
    router.get('/products');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Produk" />

      <div className="flex h-full flex-col gap-6 rounded-xl p-4">
        <form onSubmit={handleSubmit} className="ml-4 flex flex-row gap-4 space-y-6">
          <div className="flex-1">
            <div className="dark:bg-sidebar flex flex-col space-y-6 rounded-lg border-r px-6 py-6">
              <HeadingSmall title="Product Identity" description="Update your product identity" />

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="name"
                  placeholder="Input your product name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={String(data.category)} onValueChange={(value) => setData('category', Number(value))}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Choose category" />
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

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="short_content">Short Description</Label>
                <Textarea
                  className="mt-1 w-full"
                  id="short_content"
                  placeholder="Input your short description"
                  value={data.short_content}
                  onChange={(e) => setData('short_content', e.target.value)}
                />
                {errors.short_content && <p className="text-red-500">{errors.short_content}</p>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor value={data.content} onChange={(e) => setData('content', e)} />
                {errors.content && <p className="text-red-500">{errors.content}</p>}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="dark:bg-sidebar flex flex-col space-y-6 rounded-lg border-r px-6 py-6">
              <HeadingSmall title="Additional Product Data" description="Update your other product data" />

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="term">Terms & Conditions</Label>
                <RichTextEditor value={data.term} onChange={(e) => setData('term', e)} />
                {errors.term && <p className="text-red-500">{errors.term}</p>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="termInput">Upload your terms & conditions</Label>
                <Input id="term" type="file" />
                {errors.term && <p className="text-sm text-red-500">{errors.term}</p>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="name">Status</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Choose status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="text-sm" value="DONE">
                      DONE
                    </SelectItem>
                    <SelectItem className="text-sm" value="RUN">
                      RUN
                    </SelectItem>
                    <SelectItem className="text-sm" value="CLOSE">
                      CLOSE
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500">{errors.status}</p>}
              </div>
            </div>
          </div>
        </form>

        <div className="flex flex-row justify-end gap-2">
          <Button type="submit" disabled={processing}>
            Save
          </Button>
          <Button variant={'outline'} className="ml-2" onClick={returnPage}>
            Cancel
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
