import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { prisma, ShoppingList, Item } from "@repo/database";

type ListWithItems = ShoppingList & {
  items: Item[];
};

export default async function Home() {
  let lists: ListWithItems[] = [];
  try {
    lists = await prisma.shoppingList.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.log(
      "Failed to fetch shopping lists:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Shopping Lists</h1>
          <p className="text-gray-600">Create and manage your shopping lists</p>
        </div>
        <Link href="/lists/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New List
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.length === 0 ? (
          <div className="col-span-full">
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">
                No shopping lists yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first shopping list to get started
              </p>
              <Link href="/lists/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New List
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          lists.map((list) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{list.name}</h3>
              <p className="text-gray-600 mb-4">
                Created {new Date(list.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {list.items.length} items
                </span>
                <span className="text-blue-600 hover:text-blue-800">
                  View List →
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
