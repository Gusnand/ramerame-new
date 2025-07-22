import { DatePicker } from '@/components/date-picker';
import { useDropzone } from '@/components/dropzone';
import ImageDropzone from '@/components/dropzone_backup';
import { FileDropzone } from '@/components/file-dropzone';
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
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Category = {
  id: number;
  category_name: string;
};

type Bank = {
  id: number;
  value: string;
  label: string;
};

type ProductDocument = {
  id: number;
  docname: string;
  description: string;
  path: string;
};

type CCTVSettings = {
  cctv_username: string;
  cctv_password?: string; // Password bisa jadi tidak dikirim balik dari server
  cctv_cloud_serial: string;
  cctv_name: string;
  cctv_android_app?: string;
  cctv_ios_app?: string;
  guidance?: string;
  attachment?: string;
};

type Product = {
  id: number;
  product_name: string;
  product_category_id: number;
  product_slug: string;
  content: string;
  term: string;
  status: string;
  expired_date?: Date;
  invest_month: number;
  max_slot: number;
  platform_fee: number;
  invest_amount: number;
  ec_unit: number;
  ec_rate: number;
  ec_unit_remaining: number;
  account_no: string;
  on_behalf_of: string;
  bank_id: number;
  description: string;
  price: number;
  address: string;
  embedmap: string;
  image_1_url: string;
  image_2_url: string;
  image_3_url: string;
  documents: ProductDocument[];
};

export default function EditProduct({
  product,
  categories,
  banks,
  cctv_settings,
}: {
  product: Product;
  categories: Category[];
  banks: Bank[];
  cctv_settings: CCTVSettings | null;
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Edit Produk',
      href: `/products/editproduct/${product.id}`,
    },
  ];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    name: product.product_name,
    category: product.product_category_id,
    short_content: product.product_slug,
    content: product.content,
    term: product.term,
    term_condition_file: null as File | null,
    status: product.status,
    expired_date: product.expired_date,
    invest_month: product.invest_month,
    max_slot: product.max_slot,
    platform_fee: product.platform_fee,
    invest_amount: product.invest_amount,
    invest_duration: product.invest_month,
    total_unit: product.ec_unit,
    price_per_unit: product.ec_rate,
    remaining_unit: product.ec_unit_remaining,
    image_1: null,
    image_2: null,
    image_3: null,
    account_no: product.account_no,
    on_behalf_of: product.on_behalf_of,
    bank_id: product.bank_id,
    embed_map: product.embedmap,
    address: product.address,
    cctv_username: cctv_settings?.cctv_username ?? '',
    cctv_password: cctv_settings?.cctv_password ?? '',
    cctv_cloud_serial: cctv_settings?.cctv_cloud_serial ?? '',
    cctv_name: cctv_settings?.cctv_name ?? '',
    android_app: cctv_settings?.cctv_android_app ?? '',
    ios_app: cctv_settings?.cctv_ios_app ?? '',
    guidance: cctv_settings?.guidance ?? '',
    attachment: cctv_settings?.attachment ?? '',

    new_document: null as File | null,
    new_document_description: '',
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    put(route('products.update', product.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Product updated successfully');
        // Add slight delay before redirect to ensure toast is visible
        setTimeout(() => {
          router.get('/products');
        }, 1000);
      },
      onError: (errors) => {
        toast.error('Failed to update product. Please check the form for errors.');
        console.error('Update errors:', errors);
        // Highlight first error field
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      },
    });
  };

  const returnPage = () => {
    toast.info('Changes discarded');
    router.get('/products');
  };

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        status: 'success',
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg'],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  const avatarSrc = dropzone.fileStatuses[0]?.result;
  const isPending = dropzone.fileStatuses[0]?.status === 'pending';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Produk" />

      <div className="flex h-full flex-col gap-6 rounded-xl p-4">
        <form onSubmit={handleSubmit} className="ml-4 flex flex-col gap-6">
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
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
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
                {errors.short_content && <p className="text-sm text-red-500">{errors.short_content}</p>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor value={data.content} onChange={(e) => setData('content', e)} />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="term">Terms & Conditions</Label>
                <RichTextEditor value={data.term} onChange={(e) => setData('term', e)} />
                {errors.term && <p className="text-sm text-red-500">{errors.term}</p>}
              </div>

              {/* <div className="grid w-full items-center gap-2">
                <Label htmlFor="termInput">Upload your terms & conditions</Label>
                <Input id="term" type="file" />
                {errors.term && <p className="text-sm text-sm text-red-500">{errors.term}</p>}
              </div> */}

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="term_condition_file">Terms & Conditions File (PDF)</Label>
                <FileDropzone file={data.term_condition_file} onFileChange={(file) => setData('term_condition_file', file)} />
                {errors.term_condition_file && <p className="text-sm text-red-500">{errors.term_condition_file}</p>}
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
                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
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
                    value={data.max_slot}
                    onChange={(e) => setData('max_slot', Number(e.target.value))}
                  />
                  {errors.max_slot && <p className="text-sm text-red-500">{errors.max_slot}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="platform_fee">Platform Fee</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="platform_fee"
                    placeholder="input platform fee"
                    value={data.platform_fee}
                    onChange={(e) => setData('platform_fee', Number(e.target.value))}
                  />
                  {errors.platform_fee && <p className="text-sm text-red-500">{errors.platform_fee}</p>}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="invest_amount">Invest Amount</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="invest_amount"
                    placeholder="input your invest amount"
                    value={data.invest_amount}
                    onChange={(e) => setData('invest_amount', Number(e.target.value))}
                    disabled={!!data.invest_amount}
                  />
                  {errors.invest_amount && <p className="text-sm text-red-500">{errors.invest_amount}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="invest_duration">Invest Duration</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="invest_duration"
                    placeholder="input your invest duration"
                    value={data.invest_month}
                    onChange={(e) => setData('invest_month', Number(e.target.value))}
                  />
                  {errors.invest_month && <p className="text-sm text-red-500">{errors.invest_month}</p>}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="bank">Bank Account</Label>
                  <Select value={String(data.bank_id)} onValueChange={(value) => setData('bank_id', Number(value))}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Choose bank" />
                    </SelectTrigger>
                    <SelectContent className="max-h-96 overflow-y-auto">
                      <SelectGroup>
                        <SelectLabel>Bank</SelectLabel>
                        {banks.map((bank) => (
                          <SelectItem key={bank.value} value={String(bank.value)} className="text-sm">
                            {bank.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.bank_id && <p className="text-sm text-red-500">{errors.bank_id}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="account_number"
                    placeholder="input your account number"
                    value={data.account_no}
                    onChange={(e) => setData('account_no', e.target.value)}
                  />
                  {errors.account_no && <p className="text-sm text-red-500">{errors.account_no}</p>}
                </div>
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="account_name">Account Name</Label>
                <Textarea
                  className="mt-1 block w-full"
                  id="account_name"
                  placeholder="input your account name"
                  value={data.on_behalf_of}
                  onChange={(e) => setData('on_behalf_of', e.target.value)}
                />
                {errors.on_behalf_of && <p className="text-sm text-red-500">{errors.on_behalf_of}</p>}
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="">Total Unit</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="total_unit"
                    placeholder="input total unit"
                    value={data.total_unit}
                    onChange={(e) => setData('total_unit', Number(e.target.value))}
                    disabled={!!data.total_unit}
                  />
                  {errors.total_unit && <p className="text-sm text-red-500">{errors.total_unit}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="">Price per Unit</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="price_per_unit"
                    placeholder="input price per unit"
                    value={data.price_per_unit}
                    onChange={(e) => setData('price_per_unit', Number(e.target.value))}
                    disabled={!!data.price_per_unit}
                  />
                  {errors.price_per_unit && <p className="text-sm text-red-500">{errors.price_per_unit}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="">Remaining Unit</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="number"
                    id="remaining_unit"
                    placeholder="input remaining unit"
                    value={data.remaining_unit}
                    onChange={(e) => setData('remaining_unit', Number(e.target.value))}
                    disabled={!!data.remaining_unit}
                  />
                  {errors.remaining_unit && <p className="text-sm text-red-500">{errors.remaining_unit}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="dark:bg-sidebar flex flex-col space-y-6 rounded-lg border-r px-6 py-6">
              <HeadingSmall title="Additional Product Data" description="Update your other product data" />
              <Label htmlFor="Product Images">Product Images</Label>
              <div className="flex flex-row gap-6">
                <div className="grid items-center gap-2">
                  <Label htmlFor="product_image_1">Image 1</Label>
                  <ImageDropzone value={data.image_1 || product.image_1_url} onChange={(file) => setData('image_1', file)} />
                  {errors.image_1 && <p className="text-sm text-red-500">{errors.image_1}</p>}
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="product_image_2">Image 2</Label>
                  <ImageDropzone value={data.image_2 || product.image_2_url} onChange={(file) => setData('image_2', file)} />
                  {errors.image_2 && <p className="text-sm text-red-500">{errors.image_2}</p>}
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="product_image_3">Image 3</Label>
                  <ImageDropzone value={data.image_3 || product.image_3_url} onChange={(file) => setData('image_3', file)} />
                  {errors.image_3 && <p className="text-sm text-red-500">{errors.image_3}</p>}
                </div>
              </div>

              <Label htmlFor="Google Maps Settings">Google Maps Location</Label>
              <div className="grid items-center gap-2">
                <Label htmlFor="Address">Address</Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="address"
                  placeholder="Input your product address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
              <div className="flex flex-row items-start gap-6">
                <div className="grid items-center gap-2">
                  <Label htmlFor="Address">Google Maps Link</Label>
                  <Textarea
                    id="embedmap"
                    placeholder="Input your Google Maps embed link"
                    value={data.embed_map}
                    onChange={(e) => setData('embed_map', e.target.value)}
                    rows={4}
                  />
                  {errors.embed_map && <p className="text-sm text-red-500">{errors.embed_map}</p>}
                </div>

                {data.embed_map && (
                  <div className="items-start gap-2">
                    <Label>Map Preview</Label>
                    <div className="mt-2 aspect-video h-full w-full self-start overflow-hidden rounded-md">
                      <iframe
                        // width="100%"
                        // height="100%"
                        src={data.embed_map}
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Product Location Map Preview"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
              <Label htmlFor="cctv_settings">CCTV Settings</Label>
              <div className="flex w-full flex-row gap-6">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="cctv_name">CCTV Name</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="text"
                    id="cctv_name"
                    placeholder="e.g., CCTV Teras Depan"
                    value={data.cctv_name}
                    onChange={(e) => setData('cctv_name', e.target.value)}
                  />
                  {errors.cctv_name && <p className="text-sm text-red-500">{errors.cctv_name}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="cctv_cloud_serial">Cloud Serial / SN</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="text"
                    id="cctv_cloud_serial"
                    placeholder="e.g., J12345678"
                    value={data.cctv_cloud_serial}
                    onChange={(e) => setData('cctv_cloud_serial', e.target.value)}
                  />
                  {errors.cctv_cloud_serial && <p className="text-sm text-red-500">{errors.cctv_cloud_serial}</p>}
                </div>
              </div>
              <div className="flex w-full flex-row gap-6">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="cctv_username">CCTV Username</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="text"
                    id="cctv_username"
                    placeholder="e.g., admin"
                    value={data.cctv_username}
                    onChange={(e) => setData('cctv_username', e.target.value)}
                  />
                  {errors.cctv_username && <p className="text-sm text-red-500">{errors.cctv_username}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="cctv_password">CCTV Password</Label>
                  <div className="relative">
                    <Input
                      className="mt-1 block w-full pr-10"
                      type={isPasswordVisible ? 'text' : 'password'}
                      id="cctv_password"
                      placeholder="Input your CCTV Password"
                      value={data.cctv_password}
                      onChange={(e) => setData('cctv_password', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-0 h-full px-3"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.cctv_password && <p className="text-sm text-red-500">{errors.cctv_password}</p>}
                </div>
              </div>
              <div className="flex w-full flex-row gap-6">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="android_app">Android App</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="text"
                    id="android_app"
                    placeholder="Input your Android App URL"
                    value={data.android_app}
                    onChange={(e) => setData('android_app', e.target.value)}
                  />
                  {errors.android_app && <p className="text-sm text-red-500">{errors.android_app}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="ios_app">IOS App</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="text"
                    id="ios_app"
                    placeholder="Input your IOS App URL"
                    value={data.ios_app}
                    onChange={(e) => setData('ios_app', e.target.value)}
                  />
                  {errors.ios_app && <p className="text-sm text-red-500">{errors.ios_app}</p>}
                </div>
              </div>
              <div className="flex w-full flex-row gap-6">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="guidance">Guidance</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="text"
                    id="guidance"
                    placeholder="Input your Android App URL"
                    value={data.guidance}
                    onChange={(e) => setData('guidance', e.target.value)}
                  />
                  {errors.guidance && <p className="text-sm text-red-500">{errors.guidance}</p>}
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="attachment">Attachment</Label>
                  <Input
                    className="mt-1 block w-full"
                    type="text"
                    id="attachment"
                    placeholder="Input your attachment URL"
                    value={data.attachment}
                    onChange={(e) => setData('attachment', e.target.value)}
                  />
                  {errors.attachment && <p className="text-sm text-red-500">{errors.attachment}</p>}
                </div>
              </div>
              <Label htmlFor="supporting_doc">Supporting Document</Label>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 px-6">
            <Button type="submit" disabled={processing}>
              Save Changes
            </Button>
            <Button type="button" variant={'outline'} className="ml-2" onClick={returnPage}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
