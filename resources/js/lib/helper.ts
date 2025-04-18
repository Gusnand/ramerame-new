export const formatHarga = (harga: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(harga);
};
