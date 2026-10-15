// src/services/serviceMapper.js
// terjemahan nama field backend <-> frontend (sesuai models/Service.js)

// backend -> tampilan
export const fromApi = (s) => ({
  id: s.id,
  nama: s.name,
  deskripsi: s.description || "", // description di database boleh null
  harga: s.price,
  garansi: Number(s.warranty_days) || 0,
  categoryId: s.category_id,
  kategori: s.category ? s.category.name : "",
});

// tampilan -> backend
// backend mewajibkan name, price, dan category_id, dan PUT juga mengirim semuanya
export const toApi = (s) => ({
  name: s.nama.trim(),
  description: s.deskripsi.trim() || null,
  price: Number(s.harga),
  warranty_days: Number(s.garansi) || 0,
  category_id: Number(s.categoryId),
});