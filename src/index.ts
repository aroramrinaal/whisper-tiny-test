import { Hono } from 'hono'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', async(c) => {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/aroramrinaal/whisper-tiny-test/master/audio/ResumeIntro.wav"
    );
    
    if (!res.ok) {
      throw new Error(`Failed to fetch audio: ${res.status} ${res.statusText}`);
    }

    const blob = await res.arrayBuffer();
    console.log(`Audio size: ${blob.byteLength} bytes`);

    if (blob.byteLength === 0) {
      throw new Error("Audio data is empty");
    }

    const input = {
      audio: [...new Uint8Array(blob)],
    };

    const response = await c.env.AI.run(
      "@cf/openai/whisper-tiny-en",
      input
    );

    return Response.json({ input: { audio: [] }, response });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
})

export default app