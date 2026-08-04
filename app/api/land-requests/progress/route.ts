import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Not authenticated as admin" }, { status: 401 });
  }

  try {
    const { reqId, progress, milestones } = await request.json();
    if (!reqId) {
      return NextResponse.json({ message: "Missing reqId" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (progress !== undefined) dataToUpdate.progress = parseInt(progress);
    if (milestones !== undefined) dataToUpdate.milestones = milestones;

    const updated = await prisma.farmingRequest.update({
      where: { id: reqId },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: "Progress updated successfully", updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error updating progress" }, { status: 500 });
  }
}
