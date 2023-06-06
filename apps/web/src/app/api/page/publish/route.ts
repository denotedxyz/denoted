import PinataSDK from "@pinata/sdk";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabase";
import { DeserializedPage } from "../../../../utils/page-helper";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

type Payload = {
  page: DeserializedPage;
};

export async function POST(req: NextRequest) {
  try {
    const { page } = (await req.json()) as Payload;

    const result = await pinata.pinJSONToIPFS(page, {
      pinataMetadata: {
        name: page.title,
      },
    });

    const insert = await supabase
      .from("page_publication")
      .insert({
        page_id: page.id,
        ipfs_cid: result.IpfsHash,
        page_title: page.title,
        publisher_address: page.createdBy.id.split(":")[4],
      })
      .select()
      .single();

    if (insert.error) {
      console.error(insert.error);
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(insert.data, { status: 200 });
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
