import Hero from "./components/Hero";
import SystemChapter from "./components/SystemChapter";
import ReviewerChapter from "./components/ReviewerChapter";
import ResultsChapter from "./components/ResultsChapter";
import FindingChapter from "./components/FindingChapter";

export default function Home() {
  return (
    <main className="page">
      <Hero />
      <SystemChapter />
      <ReviewerChapter />
      <ResultsChapter />
      <FindingChapter />
    </main>
  );
}
