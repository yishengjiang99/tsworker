import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob'
import { Readable, Transform } from 'stream'
const AZ_CONN_STR =
  'DefaultEndpointsProtocol=https;AccountName=grepmusic;AccountKey=OOmiLHvrARhZKbsBA3EF1gZDyqScQbIwk5B7zukyJcbUrSW4pHd08uxME3+QZ6aSIZm2YdLzb8OOqTW1Gow09w==;EndpointSuffix=core.windows.net'
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
