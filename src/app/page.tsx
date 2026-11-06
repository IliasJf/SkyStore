import { Benefits } from "@/components/home/Benefits";
import { Categories } from "@/components/home/Categories";
import { DayRow } from "@/components/home/DayRow";
import { Hero } from "@/components/home/Hero";
import { Questions } from "@/components/home/Questions";
import { Showcase } from "@/components/home/Showcase";
import { Today } from "@/components/home/Today";
import { Trending } from "@/components/home/Trending";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Trending />
      <div className="mt-[var(--gap-section)]">
        <Today />
      </div>
      <DayRow />
      <Showcase />
      <Benefits />
      <Questions />
    </>
  );
}
