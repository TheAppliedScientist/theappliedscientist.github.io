import Hero from "./components/Hero";
import SystemChapter from "./components/SystemChapter";
import ReviewerChapter from "./components/ReviewerChapter";
import ResultsChapter from "./components/ResultsChapter";
import FindingChapter from "./components/FindingChapter";
import CasesChapter from "./components/CasesChapter";

export default function Home() {
  return (
    <main className="page">
      <Hero />
      <SystemChapter />
      <ReviewerChapter />
      <ResultsChapter />
      <FindingChapter />
      <CasesChapter />
    </main>
  );
}
