import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const farmingRequest = await prisma.farmingRequest.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            financialRecords: {
              orderBy: { date: "desc" }
            }
          }
        },
        updates: {
          orderBy: { createdAt: "desc" }
        },
        documents: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!farmingRequest) {
      return NextResponse.json({ message: "Farming request not found" }, { status: 404 });
    }

    if ((session.user as any).role !== "admin" && farmingRequest.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ farmingRequest });
  } catch (error: any) {
    console.error("Error fetching land request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const landRequest = await prisma.farmingRequest.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!landRequest) {
      return NextResponse.json({ message: "Land request not found" }, { status: 404 });
    }

    // The user can delete the land IF the project is completed (progress === 100) 
    // OR if it was rejected.
    if (landRequest.status === "APPROVED" && landRequest.progress < 100) {
      return NextResponse.json({ 
        message: "You cannot delete an active project. It must be fully completed." 
      }, { status: 400 });
    }

    // Delete related records first
    await prisma.farmingUpdates.deleteMany({ where: { requestId: id } });
    await prisma.document.deleteMany({ where: { requestId: id } });
    
    // Delete the request
    await prisma.farmingRequest.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Land deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting land request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
