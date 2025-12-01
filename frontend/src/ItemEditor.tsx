import React from "react"
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material"

import { Item, ItemGroup } from "./api"

type ItemEditorProps = {
  selectedId: number | null
  selectedItem: Item | null
  loadingDetail: boolean
  name: string
  group: ItemGroup
  nameError: string | null
  saving: boolean
  groupOptions: ItemGroup[]
  onChangeName: (value: string) => void
  onChangeGroup: (value: ItemGroup) => void
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

const ItemEditor: React.FC<ItemEditorProps> = ({
  selectedId,
  selectedItem,
  loadingDetail,
  name,
  group,
  nameError,
  saving,
  groupOptions,
  onChangeName,
  onChangeGroup,
  onSubmit,
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {selectedId == null ? "Create New Item" : "Edit Item"}
      </Typography>

      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2}>

          {/* Name field */}

          <TextField
            label="Name"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            error={!!nameError}
            helperText={nameError ?? ""}
            size="small"
            fullWidth
          />

          {/* Group select */}

          <TextField
            select
            label="Group"
            value={group}
            onChange={(e) => onChangeGroup(e.target.value as ItemGroup)}
            size="small"
            fullWidth
          >
            {groupOptions.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            className="app-primary-button"
          >
            {saving
              ? "Saving..."
              : selectedId == null
              ? "Create Item"
              : "Save Changes"}
          </Button>
        </Stack>
      </Box>

      <Box className="app-divider" />

      <Typography variant="subtitle1" gutterBottom>
        Item Details
      </Typography>

      {loadingDetail ? (
        <CircularProgress size={20} />
      ) : selectedItem ? (
        <Stack spacing={0.5}>
          <Typography variant="body2">
            <strong>ID:</strong> {selectedItem.id}
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {selectedItem.name}
          </Typography>
          <Typography variant="body2">
            <strong>Group:</strong> {selectedItem.group}
          </Typography>
          <Typography variant="body2">
            <strong>Created:</strong>{" "}
            {new Date(selectedItem.created_at).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Updated:</strong>{" "}
            {new Date(selectedItem.updated_at).toLocaleString()}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Select an item on the left to see its details.
        </Typography>
      )}
    </>
  )
}

export default ItemEditor
