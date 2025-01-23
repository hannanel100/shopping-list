import { prisma } from "@repo/database";
import { NextResponse } from "next/server";
import { z } from "zod";

const createItemsSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1, "Item name is required"),
      quantity: z.string().optional(),
    })
  ),
});
type Params = Promise<{ listId: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const listId = (await params).listId;
  try {
    const items = await prisma.item.findMany({
      where: {
        listId: listId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: Params }) {
  const listId = (await params).listId;
  try {
    const json = await request.json();
    const parsed = createItemsSchema.safeParse(json);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const items = await prisma.$transaction(
      parsed.data.items.map((item) =>
        prisma.item.create({
          data: {
            name: item.name,
            quantity: item.quantity,
            listId: listId,
          },
        })
      )
    );

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error creating items:", error);
    return NextResponse.json(
      { error: "Error creating items" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const listId = (await params).listId;
  try {
    const json = await request.json();
    const item = await prisma.item.update({
      where: {
        id: json.id,
        listId: listId,
      },
      data: {
        checked: json.checked,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}
