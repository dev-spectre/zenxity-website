import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { id } = await request.json();
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ message: "Offer deleted" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
