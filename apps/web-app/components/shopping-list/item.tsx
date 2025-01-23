"use client";

import { Item } from "@repo/database";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface ShoppingListItemProps {
  item: Item;
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
}

export function ShoppingListItem({
  item,
  onToggle,
  onDelete,
}: ShoppingListItemProps) {
  return (
    <div className="flex items-center justify-between space-x-4 py-2">
      <div className="flex items-center space-x-3">
        <Checkbox
          id={item.id}
          checked={item.checked}
          onCheckedChange={(checked) => onToggle(item.id, checked as boolean)}
        />
        <div>
          <label
            htmlFor={item.id}
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
              item.checked ? "line-through text-neutral-500" : ""
            }`}
          >
            {item.name}
          </label>
          {item.quantity && (
            <p className="text-sm text-neutral-500">{item.quantity}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(item.id)}
        className="h-8 w-8"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
