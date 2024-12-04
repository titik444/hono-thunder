import path from 'path'
import fs from 'fs'
import { nanoid } from 'nanoid'
import { Context } from 'hono'
import moment from 'moment'
import { HTTPException } from 'hono/http-exception'

interface UploadOptions {
  uploadDir: string // Direktori tempat menyimpan file
  fileFieldName: string // Nama field file di form
}

export const uploadMiddleware = (options: UploadOptions) => {
  return async (c: Context, next: () => Promise<void>) => {
    const formData = await c.req.formData()
    const file = formData.get(options.fileFieldName) as File | null

    if (!file) {
      // Jika file tidak ada, lanjutkan ke middleware berikutnya
      await next()
      return
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'] // Format file yang diizinkan
    const maxFileSize = 10 * 1024 * 1024 // Maksimal ukuran file dalam byte (10MB)

    // Periksa ekstensi file
    const fileExtension = path.extname(file.name).toLowerCase()

    if (!allowedExtensions.includes(fileExtension)) {
      throw new HTTPException(400, { message: 'File type not allowed. Only .jpg, .jpeg, .png, .webp are allowed' })
    }

    // Periksa ukuran file
    const fileSize = file.size

    if (fileSize > maxFileSize) {
      throw new HTTPException(400, { message: 'File is too big. Maximum file size is 10MB' })
    }

    const arrayBuffer = await file.arrayBuffer()
    const bufferData = new Uint8Array(arrayBuffer) // Konversi ke Uint8Array

    // Pastikan folder upload ada
    const folderPath = `public/${options.uploadDir}/${moment().format('YYYY/MM/DD')}`

    fs.mkdirSync(folderPath, { recursive: true })

    // Tentukan nama file unik
    const filename = nanoid(16) + fileExtension
    const filePath = path.join(folderPath, filename)

    // Simpan file ke disk
    fs.writeFileSync(filePath, bufferData) // Gunakan Uint8Array

    // Tambahkan path file ke context untuk akses di middleware berikutnya
    c.set('uploadedFilePath', filePath.replace(/\\/g, '/').replace('public/', ''))

    // Lanjutkan ke middleware berikutnya
    await next()
  }
}
