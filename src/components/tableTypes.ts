import { ReactNode } from 'react'

export interface Pagination {
  page: number
  rowsPerPage: number
  count: number
}
export interface TableProps<T> {
  items: T[]
  headCells: HeadCell<T>[]
  isCollapsible?: boolean
  actions?: Action<T>[]
  pagination?: Pagination
  onSort?: (sortBy: keyof T, sortOrder: Order) => void
  onPageChanged?: (page: number) => void
  onRowsPerPageChanged?: (rowsPerPage: number) => void
}
export interface EnhancedTableProps<T> {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void
  order: Order
  orderBy: string
  headCells: HeadCell<T>[]
  isCollapsible: boolean
  hasActions: boolean
}

export type Order = 'asc' | 'desc'

export interface HeadCell<T> {
  id: keyof T
  label: string
  render: (value: T[keyof T]) => ReactNode
  showOnCollapse?: boolean
}

export interface Action<T> {
  id: string
  render: (item: T) => ReactNode
}
