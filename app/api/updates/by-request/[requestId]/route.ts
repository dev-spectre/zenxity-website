import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { requestId } = await params;
    const updates = await prisma.farmingUpdates.findMany({
      where: { requestId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ updates });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
