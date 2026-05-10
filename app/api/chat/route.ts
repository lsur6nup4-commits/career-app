import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import type { ChatRequestBody, SseEvent } from "@/types/chat";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 1024;

function sse(event: SseEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      sse({
        type: "error",
        message:
          "서버에 ANTHROPIC_API_KEY가 설정되어 있지 않아요. .env.local에 키를 등록하고 서버를 재시작해주세요.",
      }) + sse({ type: "done" }),
      { headers: { "Content-Type": "text/event-stream" } },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return new Response(sse({ type: "error", message: "잘못된 요청 형식입니다." }), {
      status: 400,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && m.content?.trim(),
  );
  if (messages.length === 0) {
    return new Response(sse({ type: "error", message: "메시지가 비어 있어요." }), {
      status: 400,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const system = buildSystemPrompt(body.diagnosisContext);
  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (e: SseEvent) => controller.enqueue(encoder.encode(sse(e)));

      try {
        const response = await client.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            send({ type: "delta", text: event.delta.text });
          }
        }
        send({ type: "done" });
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? `Anthropic API 오류 (${err.status}): ${err.message}`
            : err instanceof Error
              ? err.message
              : "알 수 없는 오류가 발생했어요.";
        send({ type: "error", message });
        send({ type: "done" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
