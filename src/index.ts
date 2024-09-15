import { Hono } from 'hono'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.post('/transcribe', async (c) => {
  const formData = await c.req.formData()
  const audioFile = formData.get('audio') as File | null

  if (!audioFile) {
    return c.json({ error: 'No audio file provided' }, 400)
  }

  const arrayBuffer = await audioFile.arrayBuffer()
  const input = {
    audio: [...new Uint8Array(arrayBuffer)],
  }

  try {
    const response = await c.env.AI.run(
      "@cf/openai/whisper-tiny-en",
      input
    )

    return c.json({ transcription: response.text,
      word_count: response.word_count
     })
  } catch (error) {
    return c.json({ error: 'Transcription failed' }, 500)
  }
})

export default app