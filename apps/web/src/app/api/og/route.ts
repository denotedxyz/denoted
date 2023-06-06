import { NextRequest, NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";
import * as Sentry from "@sentry/nextjs";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = req.nextUrl;

    const preview = await getLinkPreview(url.href, {
      followRedirects: "follow",
    });

    return NextResponse.json(preview, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
