import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
  BlobClient,
} from '@azure/storage-blob'
var parseMidi = require('midi-file').parseMidi
const AZ_CONN_STR = process.env.az_music_conn
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  context.log('HTTP trigger function processed a request.')
  const name =
    req.query.name ||
    (req.body && req.body.name) ||
    'midifiles/Another-Day-In-Paradise-1.mid'
  const ws = BlobServiceClient.fromConnectionString(AZ_CONN_STR)
  const midiContainer: ContainerClient = ws.getContainerClient('$web')
  const client = midiContainer.getBlobClient(name)
  const buffer = await client.downloadToBuffer()
  const { tracks, header } = parseMidi(buffer)

  const cols = 'deltaTime,channel,type,noteNumber,velocity,running'.split(',')
  tracks[0].map((m) => console.log(m))
  let output = `${JSON.stringify(header)}\n\n#${cols.join(',')}\n\
  ${tracks
    .map((t) =>
      t
        .filter((m) => !(m.type === 'noteOn' || m.type === 'noteOff'))
        .map((m) => JSON.stringify(m))
        .join('\n'),
    )
    .join('\n')}
  ${tracks
    .map((t) =>
      t
        .filter((m) => m.type === 'noteOn' || m.type === 'noteOff')
        .map((m) => cols.map((h) => (m[h] !== null ? m[h] : '')).join('\t'))
        .join('\n'),
    )
    .join('\n')}`
  context.res = {
    body: output,
  }
}
export default httpTrigger
