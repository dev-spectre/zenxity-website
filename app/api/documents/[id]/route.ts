import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const documentId = params.id;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }

    // Ensure user owns the document
    if (document.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    // Delete from file system if it's a local upload
    if (document.fileUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", document.fileUrl);
      try {
        await unlink(filePath);
      } catch (err) {
        console.error("Failed to delete local file:", err);
        // Continue anyway to delete from DB
      }
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ message: "Document deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
