export type Pagination = {
  currentPage: number
  perPage: number
  totalPages: number
  totalItems: number
}

export type Pageable<T> = {
  data: Array<T>
  pagination: Pagination
}
