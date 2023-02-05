import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { Box } from '@mui/system'
import { visuallyHidden } from '@mui/utils'

import { EnhancedTableProps } from './tableTypes'

export const EnhancedTableHead = <T,>(props: EnhancedTableProps<T>) => {
  const { order, orderBy, onRequestSort, headCells, isCollapsible, hasActions } = props
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {isCollapsible && <TableCell />}
        {headCells
          .filter((h) => !h.showOnCollapse)
          .map((headCell) => (
            <TableCell
              key={headCell.id as string}
              align="left"
              padding="normal"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        {hasActions && <TableCell />}
      </TableRow>
    </TableHead>
  )
}
