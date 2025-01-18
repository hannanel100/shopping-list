import { prisma } from "@repo/database";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const items = await prisma.item.findMany({
      where: {
        listId: params.listId,
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

export async function POST(
  request: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const json = await request.json();
    const item = await prisma.item.create({
      data: {
        name: json.name,
        quantity: json.quantity,
        listId: params.listId,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Error creating item" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const json = await request.json();
    const item = await prisma.item.update({
      where: {
        id: json.id,
        listId: params.listId,
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
