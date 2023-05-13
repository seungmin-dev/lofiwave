import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { cls } from "../components/util";
import YouTube, { YouTubePlayer } from "react-youtube";
import { YouTubeProps } from "react-youtube";
import { motion } from "framer-motion";

let player: YouTubePlayer;
const opts = {
  height: "0",
  width: "0",
  playerVars: {
    autoPlay: 1,
    mute: 0,
    controls: 0,
  },
};

const Home: NextPage = ({ response }) => {
  const [playingState, setPlayingState] = useState("play");
  const [musicNumber, setMusicNumber] = useState(0);

  const image = useRef<HTMLImageElement | null>(null);
  const lpImage = useRef<HTMLImageElement | null>(null);
  const title = useRef<HTMLHeadingElement | null>(null);
  const description = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    image.current!.src = response.items[0].snippet.thumbnails.high.url;
    lpImage.current!.src = response.items[0].snippet.thumbnails.medium.url;
    title.current!.textContent = response.items[0].snippet.title;
    description.current!.textContent = response.items[0].snippet.description;

    setPlayingState("stop");

    if (musicNumber) changeMusic(musicNumber);
  }, [musicNumber]);

  const onReady: YouTubeProps["onReady"] = (event) => {
    player = event.target;
    player.playVideo();
  };
  const stopPlayVideo = () => {
    if (playingState === "play") {
      setPlayingState("stop");
      player.playVideo();
    } else {
      setPlayingState("play");
      player.pauseVideo();
    }
  };
  const changeMusic = (index: number, state?: string) => {
    let item = response.items[index];

    image.current!.src = item.snippet.thumbnails.high.url;
    lpImage.current!.src = item.snippet.thumbnails.medium.url;
    title.current!.textContent = item.snippet.title;
    description.current!.textContent = item.snippet.description;

    player.loadVideoById(item.id.videoId, 0);
  };

  return (
    <div className="w-full h-screen">
      <Script src="http://www.youtube.com/iframe_api" />
      <div className="w-1/2 sm:w-full md:w-full lg:w-full h-full m-auto relative py-32 sm:pl-0 sm:py-20 md:pl-0 md:py-20 lg:pl-0 xl:pl-0">
        <div className="w-full h-full mx-auto flex flex-row sm:flex-col-reverse md:flex-col-reverse lg:flex-row lg:w-5/6 xl:w-5/6 2xl:2/3 sm:px-10">
          {/* 왼쪽 부분(재생목록) */}
          <div className="max-w-[35rem] sm:w-full sm:mx-auto md:w-[40rem] lg:w-1/2 lg:float-right lg:my-auto xl:mx-0 2xl:ml-[10rem] min-w-[26rem] h-4/6 overflow-y-scroll bg-white/70 pt-3 rounded-2xl">
            {response.items.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => setMusicNumber(index)}
                className="p-3 px-6 border-b-[1px] border-white"
              >
                <h5 className="text-gray-950">{item.snippet.title}</h5>
                <input type="hidden" value={item.snippet.thumbnails.high.url} />
              </div>
            ))}
          </div>
          {/* 오른쪽 부분(개별 재생화면) */}
          <div className="max-w-[40rem] pl-20 my-auto sm:px-10 sm:w-full sm:mx-auto md:w-full lg:w-[35rem] 2xl:ml-0 2xl:mr-0">
            <motion.div
              className="w-[20rem] h-[20rem] m-auto pt-[4rem] pl-[4rem] rounded-full bg-black"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Image
                src=""
                alt="lpImage"
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
            </motion.div>
            {/* 제어판 */}
            <div className="w-full">
              <div className="w-[200px] m-auto pt-6 flex justify-between">
                <button
                  onClick={() =>
                    setMusicNumber(musicNumber !== 0 ? musicNumber - 1 : 0)
                  }
                  className={cls(musicNumber !== 0 ? "" : "cursor-not-allowed")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={cls(
                      "w-10 h-10",
                      musicNumber === 0 ? "text-gray-400" : "text-white"
                    )}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                    />
                  </svg>
                </button>
                <button onClick={stopPlayVideo}>
                  {playingState === "stop" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() =>
                    setMusicNumber(musicNumber !== 49 ? musicNumber + 1 : 49)
                  }
                  className={cls(
                    musicNumber === 49 ? "cursor-not-allowed" : ""
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                    />
                  </svg>
                </button>
              </div>
              <YouTube
                videoId={response.items[0].id.videoId}
                opts={opts}
                onReady={onReady}
              />
            </div>
            <div className="pt-5">
              <h2 className="text-xl text-white text-center" ref={title}></h2>
              <p
                className="text-white opacity-70 text-center pb-6"
                ref={description}
              ></p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full absolute top-0 left-0 -z-10 overflow-hidden">
        <Image
          src=""
          alt=""
          ref={image}
          fill
          className="blur-md"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: -100,
          }}
        />
      </div>
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
