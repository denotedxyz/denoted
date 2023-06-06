import { NextResponse } from "next/server";
import { IncomingForm, File } from "formidable";
import { PassThrough } from "stream";
import PinataSDK, { PinataPinResponse } from "@pinata/sdk";
import * as Sentry from "@sentry/nextjs";

type IpfsUpload = PinataPinResponse & { Filename: string };

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

export default async function POST(req: Request) {
  const uploadPromises: Promise<IpfsUpload>[] = [];

  const formData = await req.formData();
  console.log(formData);

  const body = Object.fromEntries(formData);

  const Filename = originalFilename ?? newFilename;

  const promise = pinata
    .pinFileToIPFS(pass, {
      pinataMetadata: {
        name: Filename,
      },
    })
    .then(
      (results): IpfsUpload => ({
        ...results,
        Filename,
      })
    )
    .catch((error) => {
      throw new Error(`Cannot upload ${Filename} file to IPFS`, {
        cause: error,
      });
    });

  uploadPromises.push(promise);

  return pass;

  try {
    await new Promise((resolve, reject) => {
      form.parse(req, (err, _, files) => {
        if (err) {
          return reject(err);
        }
        resolve(files);
      });
    });

    const uploads = await Promise.all(uploadPromises);

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        uploads,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    Sentry.captureException(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
