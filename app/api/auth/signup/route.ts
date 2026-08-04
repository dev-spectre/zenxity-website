import { NextRequest, NextResponse } from "next/server";
import { hashPassword, validateName, validateEmail, validatePassword, validateMobileNumber } from "@/lib/auth-utils";
import { createUserRecord, findUserByEmail } from "@/lib/auth-fallback";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, mobileNumber } = await request.json();

    if (!name || !email || !password || !mobileNumber) {
      return NextResponse.json({ error: "Name, email, password, and mobile number are required" }, { status: 400 });
    }
    if (!validateName(name)) return NextResponse.json({ error: "Name must be at least 2 characters long" }, { status: 400 });
    if (!validateEmail(email)) return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    const pwValid = validatePassword(password);
    if (!pwValid.valid) return NextResponse.json({ error: pwValid.message }, { status: 400 });
    if (!validateMobileNumber(mobileNumber)) return NextResponse.json({ error: "Invalid mobile number format" }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });

    const hashedPassword = await hashPassword(password);
    const user = await createUserRecord({ name, email: normalizedEmail, password: hashedPassword, mobileNumber });
    return NextResponse.json({ message: "User created successfully", user: { id: user.id, name: user.name, email: user.email, mobileNumber: user.mobileNumber } }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
