import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabase";

export async function GET(req: NextRequest) {
  try {
    const pageId = req.nextUrl.searchParams.get("pageId");

    if (!pageId) {
      return NextResponse.json(
        { success: false, message: "Missing page id" },
        { status: 400 }
      );
    }

    const select = await supabase
      .from("page_publication")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("page_id", pageId);

    if (select.error) {
      console.error(select.error);
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(select.data, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
