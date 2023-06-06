import * as Sentry from "@sentry/nextjs";
import { DIDSession } from "did-session";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabase";

type Payload = {
  pageId: string;
  ceramicSession: string;
};

export async function POST(req: NextRequest) {
  try {
    const { pageId, ceramicSession } = (await req.json()) as Payload;

    const session = await DIDSession.fromSession(ceramicSession);

    if (!session.hasSession || session.isExpired) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const publisherAddress = session.id.split(":")[4];

    const result = await supabase
      .from("page_publication")
      .delete()
      .eq("page_id", pageId)
      .eq("publisher_address", publisherAddress);

    if (result.error) {
      Sentry.captureException(result.error);
      console.error(result.error);
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 }
    );
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
