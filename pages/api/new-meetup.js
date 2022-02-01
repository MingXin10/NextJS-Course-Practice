//這邊不放component
//路徑: /api/new-meetup
//這邊的code不會在client端執行，不用怕帳密外流
import { MongoClient } from 'mongodb'
async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body
    // const {title,image,address,description} = data
    const client = await MongoClient.connect(
      'mongodb+srv://Henry:aa11aa11@cluster0.cdaw7.mongodb.net/meetups?retryWrites=true&w=majority'
    )
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const result = await meetupsCollection.insertOne(data)
    console.log(result)
    client.close()
    res.status(201).json({message:'Meetup inserted!'})//201表示新增一筆資料
  }
}
export default handler
