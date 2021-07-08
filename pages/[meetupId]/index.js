import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <MeetupDetail
      image={props.meetupData.image}
      title={props.meetupData.title}
      address={props.meetupData.address}
      description={props.meetupData.description}
    ></MeetupDetail>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://lcc0731:970731@cluster0.qllyl.mongodb.net/meetups?retryWrites=true&w=majority", {useUnifiedTopology: true}
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://lcc0731:970731@cluster0.qllyl.mongodb.net/meetups?retryWrites=true&w=majority", {useUnifiedTopology: true}
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});
  // console.log(selectedMeetup);
  client.close();


  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        image:
          selectedMeetup.image,
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
