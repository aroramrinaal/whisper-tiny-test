import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: CloudflareBindings }>()

// Enable CORS for all routes
app.use('*', cors())

app.post('/transcribe', async (c) => {
  
  const formData = await c.req.formData()
  const audioFile = formData.get('audio') as File | null

  if (!audioFile) {
    return c.json({ error: 'No audio file provided' }, 400)
  }

  const arrayBuffer = await audioFile.arrayBuffer()

  const input = {
    audio: [...new Uint8Array(arrayBuffer)],
  };

  try{
  const response = await c.env.AI.run(
    "@cf/openai/whisper-tiny-en",
    input
  );
  return c.json({ transcription: response.text,
   })
} catch (error) {
  if (error instanceof Error) {
    return c.json({ error: error.message }, 500)
  }
  return c.json({ error: 'An unknown error occurred' }, 500)
}
})

export default app