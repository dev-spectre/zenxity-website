import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const farmingRequests = await prisma.farmingRequest.findMany({
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
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ farmingRequests });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") return NextResponse.json({ message: "Not authenticated as admin" }, { status: 401 });

  try {
    const { reqId, status } = await request.json();
    if (!reqId || !status) return NextResponse.json({ message: "Missing reqId or status" }, { status: 400 });

    const updated = await prisma.farmingRequest.update({
      where: { id: reqId },
      data: { status: status === "accept" ? "APPROVED" : "REJECTED" },
    });
    return NextResponse.json({ updated });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error updating request" }, { status: 500 });
  }
}
