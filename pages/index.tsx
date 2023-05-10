import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useRef } from "react";

const Home: NextPage = ({ response }) => {
  const image = useRef<HTMLImageElement | null>(null);
  const lpImage = useRef<HTMLImageElement | null>(null);
  const title = useRef<HTMLHeadingElement | null>(null);
  const description = useRef<HTMLParagraphElement | null>(null);

  const onClickList = (item) => {
    image.current!.src = item.snippet.thumbnails.high.url;
    lpImage.current!.src = item.snippet.thumbnails.medium.url;
    title.current!.textContent = item.snippet.title;
    description.current!.textContent = item.snippet.description;
  };

  useEffect(() => {
    image.current!.src = response.items[0].snippet.thumbnails.high.url;
    lpImage.current!.src = response.items[0].snippet.thumbnails.medium.url;
  }, []);
  return (
    <div className="w-full h-screen relative overflow-hidden pt-32 pl-52">
      <div className="w-full h-full flex">
        <div className="w-4/12 h-4/6 overflow-y-scroll bg-white p-8 rounded-2xl">
          {response.items.map((item: any) => (
            <div
              key={item.id.videoId}
              onClick={() => onClickList(item)}
              className="mb-3"
            >
              <h5 className="text-gray-950">{item.snippet.title}</h5>
              {/* <p className="text-gray-600">{item.snippet.description}</p> */}
              <input type="hidden" value={item.snippet.thumbnails.high.url} />
            </div>
          ))}
        </div>
        {/* 오른쪽 부분(개별 재생화면) */}
        <div className="pl-20">
          <div className="rounded-full bg-black w-[20rem] h-[20rem] pt-[4rem] pl-[4rem]">
            <Image
              src=""
              alt=""
              className="relative block w-1/2 h-1/2"
              ref={lpImage}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
                width: "12rem",
                height: "12rem",
                borderRadius: "100%",
                position: "relative",
              }}
            />
          </div>
          {/* 제어판 */}
          <div></div>
          <div className="pt-5">
            <h2 className="text-xl text-white" ref={title}></h2>
            <p className="text-white opacity-70" ref={description}></p>
          </div>
        </div>
      </div>
      <Image
        src=""
        alt=""
        ref={image}
        fill
        className="blur-md"
        style={{
          width: "free",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: -100,
        }}
      />
    </div>
  );
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
