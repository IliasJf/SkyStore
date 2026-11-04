import { LineUp } from "@/components/home/LineUp";
import { PinnedSky } from "@/components/home/PinnedSky";
import { Promises } from "@/components/home/Promises";
import { Questions } from "@/components/home/Questions";
import { Showcase } from "@/components/home/Showcase";
import { Today } from "@/components/home/Today";

export default function Home() {
  return (
    <>
      <PinnedSky />
      <Showcase />
      <Today />
      <LineUp />
      <Promises />
      <Questions />
    </>
  );
}
