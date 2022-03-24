import fs from 'fs'
import fetch from 'node-fetch'
import { join } from 'path'
import FormData from 'form-data'

export default async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.SLACK_BOT_TOKEN}`) {
    return res.status(401).send('Unauthorized request')
  }
  
  const now = new Date().toISOString().substring(0, 10)
  const thursday = fs.readFileSync(join(__dirname, 'thursday.jpg'))
  const form = new FormData()
  form.append('file', thursday, {
    filename: now + '.jpg',
    contentType: 'image/jpeg',
    knownLength: thursday.length
  })
  form.append('channels', 'C0163QDUNBW')
  form.append('token', process.env.SLACK_BOT_TOKEN)

  await fetch('https://slack.com/api/files.upload', {
    method: 'POST',
    body: form
  }).then(r => r.json()).then(r => console.log(r))
  return res.status(200).end()
}
