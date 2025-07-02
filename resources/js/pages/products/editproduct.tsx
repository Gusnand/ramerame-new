import { DatePicker } from '@/components/date-picker';
import HeadingSmall from '@/components/heading-small';
import RichTextEditor from '@/components/richtext-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        <form onSubmit={handleSubmit} className="ml-4 flex flex-col gap-4 space-y-6">
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
                <Label htmlFor="status">Status</Label>
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
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="expired_date">Expired Date</Label>
                <DatePicker value={data.expired_date} onChange={(e) => setData('expired_date', e)}></DatePicker>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="max_slot">Max Slot</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="max_slot"
                    placeholder="input your product max slot"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {errors.name && <p className="text-red-500">{errors.expired_date}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="platform_fee">Platform Fee</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="platform_fee"
                    placeholder="input platform fee"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {/* {errors.name && <p className="text-red-500">{errors.platform_fee}</p>} */}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="invest_price">Invest Price</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="invest_price"
                    placeholder="input your invest price"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {errors.name && <p className="text-red-500">{errors.expired_date}</p>}
                  {/* INVEST PRICE INI NANTI KUNCI FORMNYA KALAU SUDAH ADA ANGKA DARI DB, TIDAK BOLEH DIUBAH */}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="invest_duration">Invest Duration</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="invest_duration"
                    placeholder="input your invest duration"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {/* {errors.name && <p className="text-red-500">{errors.platform_fee}</p>} */}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="bank">Bank Account</Label>
                  <Select value={data.bank} onValueChange={(value) => setData('bank', value)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Choose bank" />
                    </SelectTrigger>
                    <SelectContent className="max-h-96 overflow-y-auto">
                      <SelectGroup>
                        <SelectLabel>Bank</SelectLabel>
                        <SelectItem className="text-sm" value="DONE">
                          BNI (Bank Negara Indonesia)
                        </SelectItem>
                        <SelectItem className="text-sm" value="RUN">
                          BRI (Bank Rakyat Indonesia)
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          BCA (Bank Central Asia)
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Mandiri
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          BPD Bali (Bank Pembangunan Daerah)
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank BNI Syariah
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Mandiri Syariah
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank CIMB Niaga
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank CIMB Niaga Syariah
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Muamalat
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank BTPN
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Jenius
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank BRI Syariah
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank BTN
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Permata
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Danamon
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Maybank
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Mega
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Bukopin
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Commonwealth
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank BCA Syariah
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Citibank
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank NTB
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank NTB Syariah
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          OCBC NISP
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          BPR Lestari
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank INA
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Bank Syariah Indonesia
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Superbank Indonesia
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="mt-2">Others</SelectLabel>
                        <SelectItem className="text-sm" value="CLOSE">
                          Indosat Dompetku
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Telkomsel TCash
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          LinkAJA
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          DANA
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          BCA Digital
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          KSP Pertiwi
                        </SelectItem>
                        <SelectItem className="text-sm" value="CLOSE">
                          Fliptech Lentera
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.name && <p className="text-red-500">{errors.expired_date}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="account_number"
                    placeholder="input your account number"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {/* {errors.name && <p className="text-red-500">{errors.platform_fee}</p>} */}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="account_name">Account Name</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="text"
                    id="account_name"
                    placeholder="input your account name"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {/* {errors.name && <p className="text-red-500">{errors.platform_fee}</p>} */}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="">Total Unit</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="total_unit"
                    placeholder="input total unit"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {/* {errors.name && <p className="text-red-500">{errors.platform_fee}</p>} */}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="">Price per Unit</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="price_per_unit"
                    placeholder="input price per unit"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {/* {errors.name && <p className="text-red-500">{errors.platform_fee}</p>} */}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="">Remaining Unit</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="remaining_unit"
                    placeholder="input remaining unit"
                    // value={data.max_slot}
                    // onChange={(e) => setData('max_slot', e.target.value)}
                  />
                  {/* {errors.name && <p className="text-red-500">{errors.platform_fee}</p>} */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="dark:bg-sidebar flex flex-col space-y-6 rounded-lg border-r px-6 py-6">
              <HeadingSmall title="Additional Product Data" description="Update your other product data" />

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="product_image" className="mb-2">
                  Product Image
                </Label>
                <div>
                  <Label htmlFor="product_image_1">Image 1</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="image"
                    id="product_image_1"
                    placeholder="Input your product image"
                    value={data.image_1}
                    onChange={(e) => setData('image_1', e.target.value)}
                  />
                  {errors.image_1 && <p className="text-red-500">{errors.image_1}</p>}
                </div>
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
