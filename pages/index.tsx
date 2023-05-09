import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = (response) => {
  console.log(response);
  return <div></div>;
};

export async function getServerSideProps() {
  const response = await (
    await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&q=lofimusic&maxResults=50`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).json();

  return {
    props: { response },
  };
}

export default Home;
