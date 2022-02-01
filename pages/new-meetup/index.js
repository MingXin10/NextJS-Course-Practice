import NewMeetupForm from '../../components/meetups/NewMeetupForm'
import { useRouter } from 'next/router'
import Head from 'next/head'
const NewMeetupPage = (props) => {
  const router = useRouter()
  async function addMeetupHandler(enteredMeetupData) {
  const response = await fetch('/api/new-meetup', {
    method: 'POST',
    body: JSON.stringify(enteredMeetupData),
    headers:{
      'Content-Type':'application/json'
    }
  }) //內部api
  const data = await response.json()
  // console.log(data) //訊息出現在前端
  router.replace('/') //如果使用router.push 可以回上一頁
  }
  return (
    <>
      <Head>
        <title>Add a new meetup</title>
        <meta
          name="description"
          content="Add your own meetups and create amazing networking opportunity"
        />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </>
  )
}
export default NewMeetupPage