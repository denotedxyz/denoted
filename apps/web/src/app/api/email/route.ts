import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { email } = await req.json();

    const apiKey = process.env.MAILERLITE_API_KEY as string;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "Invalid configuration" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        body: JSON.stringify({ email, groups: ["82806046959076689"] }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const json = await response.json();

    console.info("mailerlite response:", json);

    return NextResponse.json(
      { success: true, message: "signed up" },
      { status: 201 }
    );
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);

    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
