
# flexibleMuiTable

Full customizable generic MUI table React component
- 100 % Typescript
- Full customization
- A presentational component
- Respect of **Open/Closed principles** with a full extensibility
    1. Add of pagination on demand
    2. Add of row actions on demand
    3. Add of collapse feature to show more details on demand
    4. Smart cells building by passing a render method. Example: *use a chip component for a specific cell*  
- Support of  **Sorting**, **Pagination**, **Collapsible Table**
- Generic component that allows to pass your data type into your component making it reusable, strongly typed and clean. For instance if you wanna use it for TODO list, here is the clean way

   ```jsx
   export Interface TODO {
	   name: string
	   status: 'pending' | 'done'
   }
   ...
   <FlexibleMuiTable<TODO>  ...props />
   ```

## 🍴 How to use it ?
### Installation
`npm install flexible-mui-table`
Or
`yarn add flexible-mui-table`

After installation done, lets starts by the props (props and callback props).
Here is the props type of our magic component
```typescript
export interface FlexibleTableProps<T> {
  items: T[]
  headCells: HeadCell<T>[]
  actions?: Action<T>[]
  pagination?: Pagination
  onSort?: (sortBy:  keyof  T, sortOrder:  Order) =>  void
  onPageChanged?: (page:  number) =>  void
  onRowsPerPageChanged?: (rowsPerPage:  number) =>  void
}
```

### Props

#### items (required)
Items property  is the data array of type T[]

#### headCells (required)
HeadCells is an easy and complete way  to define your table head cells their ids, labels, and how to render each cell using a render method that return a **ReactNode**.
If you need to Enable Collapse features on your  table, you have to set showOnCollapse to true on  at least one element of todoCells bellow.
Properties that have **showOnCollapse** equal to true will be displayed on the collapse content.
Check Mui docs for more details https://mui.com/material-ui/react-table/#collapsible-table  

For our TODO example, a headCells array that you have to prepare should look like this:
```typescript
import { HeadCell } from  'flexible-mui-table'
const  todoCells: HeadCell<User>[] = [
 {
  id: 'name',
  label: 'Name',
  render: (value) =>  value,
  // showOnCollapse is used to distinguish cells that are visible by default
  // and those displayed on collapse event when isCollapsible is true
  showOnCollapse: false,
 },
 {
  id: 'status',
  label: 'Status',
  // You have to possibility to render the status as a ReactNode
  render: (value) => (<Chip color='success' icon={<PendingIcon/>} label={value} variant='outlined' />),
  showOnCollapse: false,
 }
]
```
🚨  *Only the properties that are present in headCells config can be shown inside FlexibleMuiTable component*

#### actions (optional)
Full customizable list of row actions. Here is how you add EDIT/REMOVE actions to a TODO row

```typescript
import { Action } from  'flexible-mui-table'
const  userActions:Action<User>[] = [
  {
   id: 'edit',
   render: (todo: TODO) => (<MenuItem  id='edit-menu-item'  key={`edit-${todo.name}`} onClick={(e) =>  handleEdit(e, todo)}>
              <EditIcon/> Edit </MenuItem>),
 },
 {
  id: 'remove',
  render: (todo: TODO) => (<MenuItem id='remove-menu-item' key={`remove-${todo.id}`} onClick={(e) =>  handleRemove(e, todo)}>
    <DeleteIcon  /> Remove </MenuItem>),
 },
]
```

#### pagination (optional)
A pagination object that contains **the current page, rows per page and count**.
```typescript
export interface Pagination {
  page:number
  rowsPerPage:number
  count:number
}
```
🚨  *If absent pagination feature is disabled*

FlexibleMuiTable flow chart:

```mermaid
%%{init: {'theme': 'forest', "flowchart" : { "curve" : "basis" } } }%%
graph LR
A{Parent component} -- Items -->B((FlexibleMuiTable))
A{Parent component} -- HeadCells --> B((FlexibleMuiTable))
A{Parent component} -- Actions --> B((FlexibleMuiTable))
A{Parent component} -- Pagination --> B((FlexibleMuiTable))
B -- onSort Event --> A
B -- onPageChanged Event --> A
B -- onRowsPerPageChanged Event --> A