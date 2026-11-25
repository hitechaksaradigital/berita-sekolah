import imageCompression from 'browser-image-compression'

// Menjaga unggahan tetap ringan (target < 300KB) sebelum masuk Supabase Storage.
export async function compressImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.')
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: 'image/jpeg',
    })
  } catch {
    return file
  }
}
