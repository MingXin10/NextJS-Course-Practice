import { MongoClient,ObjectId } from 'mongodb'
import MeetupDetail from '../../components/meetups/MeetupDetail'
import Head from 'next/head'
const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta
          name="description"
          content={props.meetupData.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  )
}
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://Henry:aa11aa11@cluster0.cdaw7.mongodb.net/meetups?retryWrites=true&w=majority'
  )
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray() //第一個empty{}表示找出所有documents，第二個表示篩選id，其他value不要
  client.close()
  return {
    //fallback為fall=>只會render paths裡面有的內容，如果使用者直接key paths沒有的，會得到404。可以用來設定使用者較常造訪的頁面
    //fallback為true=>會從server找符合的資料。設定較少造訪的，就不會造成太多request，有快取效果
    //blocking
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString()
      }
    })),
    // paths: [{ params: { meetupId: 'm1' } }, { params: { meetupId: 'm2' } }]
  }
}
export async function getStaticProps(context) {
  //fetch data for single meetup
  //需要辨識哪一筆資料，但是useRouter只能在component裡面使用
  //透過context可以取得
  const meetupId = context.params.meetupId //meetupId相當於 route 的 [meetupId] (當作key)
  const client = await MongoClient.connect(
    'mongodb+srv://Henry:aa11aa11@cluster0.cdaw7.mongodb.net/meetups?retryWrites=true&w=majority'
  )
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId)
  }) //mongodb的資料ID型式為ObjectId，沒辦法單靠meetupId找資料

  client.close()
  console.log(meetupId) //只會在終端機看到，因為getStaticProps只會在build time執行，前端看不到
  return {
    props: {
      // meetupData: {
      //   image:
      //     'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
      //   id: meetupId,
      //   title: 'First Meetup',
      //   address: 'Some Street 5, Some City',
      //   description: 'The meetup description'
      // }
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      },
    revalidate: 30
    }
  }
}

export default MeetupDetails
