import { prisma } from "@repo/database";
import { ShoppingListView } from "@/components/shopping-list/list";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ListPageProps {
  params: {
    id: string;
  };
}

export default async function ListPage({ params }: ListPageProps) {
  const list = await prisma.shoppingList.findUnique({
    where: {
      id: params.id,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!list) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lists
            </Button>
          </Link>
        </div>

        <ShoppingListView list={list} />
      </div>
    </div>
  );
}
