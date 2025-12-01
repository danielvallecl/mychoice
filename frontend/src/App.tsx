import React, { useEffect, useState } from "react"

// MUI Components
import { Box, Paper, Typography, Alert } from "@mui/material"

// API Methods
import {
  Item,
  ItemGroup,
  getItems,
  getItem,
  createItem,
  updateItem,
} from "./api"

// Components
import ItemList from "./ItemList"
import ItemEditor from "./ItemEditor"

// CSS
import "./App.css"

const GROUP_OPTIONS: ItemGroup[] = ["Primary", "Secondary"]

const App: React.FC = () => {
  // List state
  const [items, setItems] = useState<Item[]>([])
  const [listLoading, setListLoading] = useState(false)

  // Selected Item
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Form State
  const [name, setName] = useState("")
  const [group, setGroup] = useState<ItemGroup>("Primary")
  const [saving, setSaving] = useState(false)

  // Validation and Messages
  const [nameError, setNameError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [messageSeverity, setMessageSeverity] = useState<"success" | "error">(
    "success",
  )

  // Message Helpers
  const showMessage = (text: string, severity: "success" | "error") => {
    setMessage(text)
    setMessageSeverity(severity)
  }

  const clearMessage = () => setMessage(null)

  const resetForm = () => {
    setName("")
    setGroup("Primary")
    setNameError(null)
  }

  // Load All Items on Mount
  useEffect(() => {
    const load = async () => {
      setListLoading(true)
      clearMessage()
      try {
        const data = await getItems()
        setItems(data)
      } catch (err) {
        console.error(err)
        showMessage("Failed to load items from API", "error")
      } finally {
        setListLoading(false)
      }
    }

    load()
  }, [])

  // Load Single Item upon Selection
  useEffect(() => {
    if (selectedId == null) {
      setSelectedItem(null)
      resetForm()
      return
    }

    const loadItem = async () => {
      setDetailLoading(true)
      clearMessage()
      try {
        const item = await getItem(selectedId)
        setSelectedItem(item)
        setName(item.name)
        setGroup(item.group)
      } catch (err) {
        console.error(err)
        showMessage("Failed to load item details", "error")
      } finally {
        setDetailLoading(false)
      }
    }

    loadItem()
  }, [selectedId])

  // Create New Item
  const handleNewItem = () => {
    setSelectedId(null)
    setSelectedItem(null)
    resetForm()
    clearMessage()
  }

  // Form Validation
  const validate = () => {
    if (!name.trim()) {
      setNameError("Name is required.")
      return false
    }
    setNameError(null)
    return true
  }

  // Create or Update Submit Handler
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    clearMessage()

    if (!validate()) return

    setSaving(true)
    try {
      if (selectedId == null) {
        // Create
        const created = await createItem({
          name: name.trim(),
          group,
        })
        setItems((prev) => [...prev, created])
        setSelectedId(created.id)
        setSelectedItem(created)
        showMessage("Item created successfully", "success")
      } else {
        // Update
        const updated = await updateItem(selectedId, {
          name: name.trim(),
          group,
        })
        setItems((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i)),
        )
        setSelectedItem(updated)
        showMessage("Item updated successfully", "success")
      }
    } catch (err: any) {
      console.error(err)
      const data = err?.response?.data

      let detail: unknown =
        data?.detail ||
        (Array.isArray(data?.name) ? data.name.join(" ") : data?.name) ||
        (Array.isArray(data?.group) ? data.group.join(" ") : data?.group) ||
        "Item already exists in this group."

      // Normalize Errors
      const normalized = String(detail).toLowerCase()
      if (
        normalized.includes("unique") ||
        normalized.includes("already") ||
        normalized.includes("exists") ||
        normalized.includes("must make a unique set") ||
        normalized.includes("item with this")
      ) {
        detail = "Item already exists in this group"
      }
      showMessage(String(detail), "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box className="app-root">
      <Paper elevation={6} className="app-shell">
        <Typography variant="h4" gutterBottom className="app-title">
          MyChoice – Item Manager
        </Typography>

        {/* Messages */}

        {message && (
          <Box className="app-alert">
            <Alert
              severity={messageSeverity}
              onClose={() => setMessage(null)}
              variant="outlined"
            >
              {message}
            </Alert>
          </Box>
        )}

        <Box className="app-layout">

          {/* Item List Component  */}

          <Paper className="app-column app-column--left" elevation={0}>
            <ItemList
              items={items}
              loading={listLoading}
              selectedId={selectedId}
              onSelectItem={setSelectedId}
              onNewItem={handleNewItem}
            />
          </Paper>

          {/* Item Editor Component */}

          <Paper className="app-column app-column--right" elevation={0}>
            <ItemEditor
              selectedId={selectedId}
              selectedItem={selectedItem}
              loadingDetail={detailLoading}
              name={name}
              group={group}
              nameError={nameError}
              saving={saving}
              groupOptions={GROUP_OPTIONS}
              onChangeName={setName}
              onChangeGroup={(g) => setGroup(g)}
              onSubmit={handleSubmit}
            />
          </Paper>
        </Box>
      </Paper>
    </Box>
  )
}

export default App
