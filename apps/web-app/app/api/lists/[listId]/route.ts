import { prisma } from "@repo/database";
import { NextResponse } from "next/server";

type Params = Promise<{ listId: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;

  try {
    const list = await prisma.shoppingList.findUnique({
      where: {
        id: params.listId,
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
      return NextResponse.json(
        { error: "Shopping list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return NextResponse.json(
      { error: "Error fetching shopping list" },
      { status: 500 }
    );
  }
}
