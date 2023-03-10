import CancelIcon from '@mui/icons-material/Cancel'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import React, { PropsWithChildren, useMemo, useRef, useState } from 'react'

import { EnhancedTableHead } from './EnhancedTableHead'
import { Action, AwesomeTableProps, HeadCell, Order } from './tableTypes'

function Row<T>(props: {
  row: T
  isCollapsible: boolean
  headCells: HeadCell<T>[]
  index: number
  actions?: Action<T>[]
}) {
  const { row, isCollapsible, headCells, actions, index } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [currentTarget, setCurrenttarget] = useState<T>()
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>, actionOn: T) => {
    setAnchorEl(event.currentTarget)
    setCurrenttarget(actionOn)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setCurrenttarget(undefined)
  }

  return (
    <React.Fragment>
      <TableRow hover role="checkbox" tabIndex={-1}>
        {isCollapsible && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {headCells
          .filter((h) => !h.showOnCollapse)
          .map((h) => {
            return (
              <TableCell key={h.id as string} align="left">
                {h.render(row[h.id])}
              </TableCell>
            )
          })}
        {actions && (
          <TableCell align="right" key={`action-${index}`}>
            <IconButton
              onClick={(event) => handleClick(event, row)}
              size="medium"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              id={`user-menu-btn-${index}`}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id={`user-menu-${index}`}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {actions.map((a) => a.render(currentTarget || row))}
            </Menu>
          </TableCell>
        )}
      </TableRow>
      {isCollapsible && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={isCollapsed} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  margin: 1,
                  padding: 1,
                  bgcolor: 'grey.100',
                  borderRadius: '5px',
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  More information
                </Typography>
                <Grid container spacing={1}>
                  {headCells
                    .filter((h) => h.showOnCollapse)
                    .map((h) => {
                      return (
                        <Grid item xs={12} key={`collapse-grid-${index}-${String(h.id)}`}>
                          <Typography
                            variant="subtitle2"
                            component="span"
                            sx={{ display: 'inline' }}
                            mx={2}
                          >
                            {h.label}
                          </Typography>
                          <Typography variant="body1" component="span">
                            {h.render(row[h.id])}
                          </Typography>
                        </Grid>
                      )
                    })}
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

export const MuiAwesomeTable = <T,>({
  items,
  headCells,
  actions,
  pagination,
  isSearchable = false,
  onSort,
  onSearch,
  onCancelSearch,
  onPageChanged,
  onRowsPerPageChanged,
}: PropsWithChildren<AwesomeTableProps<T>>) => {
  const [isSearching, setisSearching] = useState(false)
  const [query, setquery] = useState('')
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<keyof T>('createdAt' as keyof T)
  const [defaultRowsPerPageOptions, setDefaultRowsPerPageOptions] = useState([5, 15, 25])
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  const calculateRowsPerPageOptions = (rowsPerPaginationInput: number | undefined) => {
    if (rowsPerPaginationInput) {
      if (defaultRowsPerPageOptions.includes(rowsPerPaginationInput)) {
        return defaultRowsPerPageOptions
      } else {
        const newDefaultRowsPerPageOptions = [
          ...defaultRowsPerPageOptions,
          rowsPerPaginationInput,
        ].sort((n1, n2) => n1 - n2)
        setDefaultRowsPerPageOptions(newDefaultRowsPerPageOptions)
        return newDefaultRowsPerPageOptions
      }
    } else {
      return defaultRowsPerPageOptions
    }
  }

  const rowsPerPageOptions = useMemo(
    () => calculateRowsPerPageOptions(pagination?.rowsPerPage),
    [pagination?.rowsPerPage],
  )

  const isCollapsible = headCells.some((h: HeadCell<T>) => h?.showOnCollapse)

  const emptyRows =
    pagination && pagination?.page > 0
      ? Math.max(0, (1 + pagination?.page) * pagination?.rowsPerPage - items?.length)
      : 0

  const handleSortRequest = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    onSort?.(property, isAsc ? 'desc' : 'asc')
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChanged?.(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChanged?.(parseInt(event.target.value, 10))
  }

  const handleClickCancelSearch = () => {
    clearTimeout(timeout.current)
    setquery('')
    setisSearching((isSearching) => !isSearching)
    onCancelSearch?.()
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setquery(e.target.value)
    setisSearching(true)
    clearTimeout(timeout.current)
    if (!e.target.value) {
      setisSearching(false)
      return
    }
    timeout.current = setTimeout(() => onSearch?.(e.target.value), 500)
  }
  const handleMouseDownCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Grid container spacing={2} justifyContent="center" flexDirection="row">
      {isSearchable && (
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              id="search"
              onChange={handleSearch}
              value={query}
              endAdornment={
                isSearching && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="cancel serach"
                      onClick={handleClickCancelSearch}
                      onMouseDown={handleMouseDownCancel}
                      edge="end"
                    >
                      <CancelIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12} sm={12}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy as string}
                onRequestSort={handleSortRequest}
                headCells={headCells}
                isCollapsible={isCollapsible}
                hasActions={!!actions}
              />
              <TableBody>
                {items?.length > 0 ? (
                  items.map((row, index) => (
                    <Row
                      key={index}
                      row={row}
                      index={index}
                      headCells={headCells}
                      isCollapsible={isCollapsible}
                      actions={actions}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="subtitle2"
                        component="span"
                        sx={{ color: 'error.light' }}
                      >
                        Something is wrong, No data to display!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {pagination && (
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={pagination.count}
              rowsPerPage={pagination.rowsPerPage}
              page={pagination.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}
