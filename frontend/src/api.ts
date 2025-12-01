import axios from 'axios'

export type ItemGroup = 'Primary' | 'Secondary'

// Create Item interface

export interface Item {
  id: number
  name: string
  group: ItemGroup
  created_at: string
  updated_at: string
}

// Create axios instance to connect to Django API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

// Fetch the full list of items
export async function getItems(): Promise<Item[]> {
  const res = await api.get<Item[]>('/items/')
  return res.data
}

// Fetch a single item by its ID
export async function getItem(id: number): Promise<Item> {
  const res = await api.get<Item>(`/items/${id}/`)
  return res.data
}

// Create a new item (name and group)
export async function createItem(data: { name: string; group: ItemGroup }): Promise<Item> {
  const res = await api.post<Item>('/items/', data)
  return res.data
}

// Update an existing item by ID
export async function updateItem(
  id: number,
  data: Partial<Pick<Item, 'name' | 'group'>>,
): Promise<Item> {
  const res = await api.patch<Item>(`/items/${id}/`, data)
  return res.data
}
