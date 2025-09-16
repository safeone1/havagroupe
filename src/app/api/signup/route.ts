import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { name, email, password } = await req.json();

  try {
    const res = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      asResponse: true,
    });

    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
};
