import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

const botToken = process.env.TELEGRAM_API_KEY;
const chatId = process.env.TELEGRAM_CHAT_ID;
const topicId = process.env.TELEGRAM_TOPIC_ID;
const bot = new TelegramBot(botToken as string, { polling: false });

type SentryWebhookPayloadData =
  | {
      resource: "issue";
      issue: {
        id: string;
        title: string;
        culprit: string;
      };
    }
  | {
      resource: "event_alert";
      event: {
        title: string;
        culprit: string;
        web_url: string;
      };
    };

function verifySignature(
  headers: Headers,
  rawBody: string,
  secret: string = ""
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const digest = hmac.digest("hex");
  return digest === headers["sentry-hook-signature"];
}

export async function POST(req: NextRequest) {
  const sentryWebhookSecret = process.env.SENTRY_WEBHOOK_SECRET || "";

  const rawBody = await req.text();

  if (verifySignature(req.headers, rawBody, sentryWebhookSecret)) {
    const body = JSON.parse(rawBody);
    const data = {
      ...body.data,
      resource: req.headers["sentry-hook-resource"],
    } as SentryWebhookPayloadData;

    const getErrorMsg = () => {
      switch (data.resource) {
        case "issue":
          return `🚨${data.issue.title}
${data.issue.culprit}
https://denoted.sentry.io/issues/${data.issue.id}/`;
        case "event_alert":
          return `🚨${data.event.title}
${data.event.culprit}
${data.event.web_url}`;
      }
    };
    await bot.sendMessage(chatId as string, getErrorMsg(), {
      message_thread_id: Number(topicId),
    });

    return NextResponse.json(
      { success: true, message: "Webhook processed successfully." },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { success: false, message: "Invalid signature." },
      { status: 403 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
