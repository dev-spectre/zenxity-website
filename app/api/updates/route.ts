import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { title, content, description, img, video, landInfo, activityDate, activityTime, requestId } = await request.json();
    if (!title || !requestId) return NextResponse.json({ message: "Title and requestId are required" }, { status: 400 });

    const update = await prisma.farmingUpdates.create({
      data: { title, content, description, img, video, landInfo, activityDate, activityTime, requestId },
    });

    return NextResponse.json({ update }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const updates = await prisma.farmingUpdates.findMany({
      where: { request: { user: { id: session.user.id } } },
      include: { request: { select: { landAddress: true, landSize: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ updates });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
