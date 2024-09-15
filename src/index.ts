import { Hono } from 'hono'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', async(c) => {
  const res = await fetch(
    ""
  );
  const blob = await res.arrayBuffer();

  const input = {
    audio: [...new Uint8Array(blob)],
  };

  const response = await c.env.AI.run(
    "@cf/openai/whisper-tiny-en",
    input
  );

  return Response.json({ input: { audio: [] }, response });
})

export default app