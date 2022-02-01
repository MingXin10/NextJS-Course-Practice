import Head from 'next/head'
import MeetupList from '../components/meetups/MeetupList'
import { MongoClient } from 'mongodb' //在pages的component引用，並且用在getServerSideProps或是getStaticProps，不會被包含在client's side bundle
// import { useState, useEffect } from 'react'
const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'A First Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
    address: 'Some address 5, 12345 Some City',
    description: 'This is a first meetup!'
  },
  {
    id: 'm2',
    title: 'A Second Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
    address: 'Some address 10, 12345 Some City',
    description: 'This is a second meetup!'
  }
]
const HomePage = (props) => {
  // const [loadedMeetups, setLoadedMeetups] = useState([])
  // useEffect(() => {
  //   //fetch data from server
  //   setLoadedMeetups(DUMMY_MEETUPS) //NextJS不會等從server拿到資料(loadedMeetups=拿到的資料)，只會render第一次生命週期的結果，所以MeetupList原始碼是空的
  // }, [])
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta name='description' content='Browser a huge list of highly active React meetups' />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}

// export async function getServerSideProps(context) {
//   const req = context.req
//   const res = context.res
//   //如果不需要利用到req，例如登入、認證的資料，或是資料更新的不頻繁，建議使用getStaticProps()
//   //fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//     //不用設定revalidate，因為對server發request，就會更新了
//   }
// }

export async function getStaticProps() {
  //此法好處是資料能夠存在CDN並且透過CDN取得資料，還有快取機制，速度較快
  //fetch data from an API
  const client = await MongoClient.connect(
    'mongodb+srv://Henry:aa11aa11@cluster0.cdaw7.mongodb.net/meetups?retryWrites=true&w=majority'
  )
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const meetups = await meetupsCollection.find().toArray() //find預設找到所有資料
  client.close()
  return {
    //只能命名為props。會傳到component
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      }))
    },
    revalidate: 30 //經過幾秒重新產新pre-render頁面。有這個就不用手動build
  }
}
export default HomePage
