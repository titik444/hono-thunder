export const response = (
  c: {
    status(status: number): void
    json: (arg0: { status: boolean; statusCode: number; message: string; data?: {} }) => void
  },
  status = 200,
  message = 'Success',
  data: {} | any[] = {}
) => {
  c.status(status)

  // Pastikan `data` selalu terdefinisi
  const responseData = Array.isArray(data) || 'pagination' in data ? { ...data } : { data }

  return c.json({
    status: true,
    statusCode: status,
    message: message,
    ...responseData
  })
}
