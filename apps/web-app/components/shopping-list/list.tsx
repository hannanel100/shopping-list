"use client";

import { ShoppingList, Item } from "@prisma/client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ShoppingListItem } from "./item";
import { Plus } from "lucide-react";

interface ShoppingListProps {
  list: ShoppingList & { items: Item[] };
}

export function ShoppingListView({ list }: ShoppingListProps) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");

  const addItem = async () => {
    if (!newItemName.trim()) return;

    try {
      const response = await fetch(`/api/lists/${list.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName,
          quantity: newItemQuantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to add item");

      // Refresh the page to show the new item
      window.location.reload();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const toggleItem = async (itemId: string, checked: boolean) => {
    try {
      const response = await fetch(`/api/lists/${list.id}/items`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemId,
          checked,
        }),
      });

      if (!response.ok) throw new Error("Failed to update item");

      // Refresh the page to show the updated item
      window.location.reload();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/lists/${list.id}/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      // Refresh the page to show the item was deleted
      window.location.reload();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{list.name}</h2>
        <p className="text-sm text-neutral-500">
          Created {new Date(list.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Add new item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <Input
            placeholder="Quantity (optional)"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
          />
          <Button onClick={addItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {list.items.map((item) => (
            <ShoppingListItem
              key={item.id}
              item={item}
              onToggle={toggleItem}
              onDelete={deleteItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
