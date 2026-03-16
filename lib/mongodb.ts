import { MongoClient } from 'mongodb'

const dbName = process.env.MONGODB_DB || 'news_cms'

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

export async function getDatabase() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  const clientPromise =
    global._mongoClientPromise ??
    new MongoClient(uri).connect()

  if (process.env.NODE_ENV !== 'production') {
    global._mongoClientPromise = clientPromise
  }

  const connectedClient = await clientPromise
  return connectedClient.db(dbName)
}
