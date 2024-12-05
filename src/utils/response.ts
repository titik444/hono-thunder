export const response = (
  c: {
    status(status: number): void
    json: (arg0: { status: boolean; statusCode: number; message: string; data?: {} }) => void
  },
  status = 200,
  message = 'Success',
  data: boolean | {} | any[] = {}
) => {
  c.status(status)

  // Pastikan `data` selalu terdefinisi
  const responseData = typeof data === 'object' ? { ...data } : { data }

  return c.json({
    status: true,
    statusCode: status,
    message: message,
    ...responseData
  })
}
