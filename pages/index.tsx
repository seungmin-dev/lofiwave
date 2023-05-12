import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import WavyText from "../components/Wavytext";
import { cls } from "../components/util";
import YouTube, { YouTubePlayer } from "react-youtube";
import { YouTubeProps } from "react-youtube";

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
    <div className="w-full h-screen overflow-hidden">
      <Script src="http://www.youtube.com/iframe_api" />
      <div className="w-1/2 h-full m-auto relative pt-32 pl-52 sm:pl-0 md:pl-0 lg:pl-0 xl:pl-0">
        <div className="w-full h-full flex flex-row sm:flex-row-reverse md:flex-row">
          {/* 왼쪽 부분(재생목록) */}
          <div className="w-4/12 min-w-[26rem] h-4/6 overflow-y-scroll bg-white/70 pt-3 rounded-2xl">
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
          <div className="pl-20">
            <div className="w-[20rem] h-[20rem] pt-[4rem] pl-[4rem] rounded-full bg-black">
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
            <div className="w-full">
              <div className="w-3/5 m-auto pt-3 flex space-between">
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
              <h2 className="text-xl text-white" ref={title}></h2>
              <p className="text-white opacity-70" ref={description}></p>
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
            width: "110%",
            height: "110%",
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
