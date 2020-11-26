import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob'
const AZ_CONN_STR = process.env.az_music_conn

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const ws = BlobServiceClient.fromConnectionString(AZ_CONN_STR)
  const midiContainer = ws.getContainerClient('$web')
  const g = midiContainer.listBlobsFlat({
    prefix: req.params.q || 'midifiles',
  })
  const ret = []
  for await (const gg of g) {
    ret.push(gg)
  }
  context.res.status = 200
  context.res.body = JSON.stringify(ret)
  return
}

export default httpTrigger
