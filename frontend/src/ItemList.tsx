import React from "react"

// MUI Components
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material"

// Icons 
import AddIcon from '@mui/icons-material/Add';

// API Methods
import { Item } from "./api"

type ItemListProps = {
  items: Item[]
  loading: boolean
  selectedId: number | null
  onSelectItem: (id: number) => void
  onNewItem: () => void
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  loading,
  selectedId,
  onSelectItem,
  onNewItem,
}) => {
  return (
    <>
      <Box className="app-column-header">
        <Typography variant="h6">Items</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={onNewItem}
          className="app-secondary-button"
        >
          New Item
        <AddIcon />
        </Button>
      </Box>

      {loading ? (
        <Box className="app-loading">
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          No items yet. Create your first one on the right.
        </Typography>
      ) : (
        <Stack spacing={1.25}>
          {items.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              className={
                selectedId === item.id
                  ? "app-item-card app-item-card--selected"
                  : "app-item-card"
              }
              onClick={() => onSelectItem(item.id)}
            >
              <Typography className="app-item-title">{item.name}</Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                className="app-item-subtitle"
              >
                Group: {item.group}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </>
  )
}

export default ItemList
