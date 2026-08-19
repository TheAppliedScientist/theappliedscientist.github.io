import Hero from "./components/Hero";
import SystemChapter from "./components/SystemChapter";
import ReviewerChapter from "./components/ReviewerChapter";
import ResultsChapter from "./components/ResultsChapter";
import FindingChapter from "./components/FindingChapter";
import AnnotatedPapersChapter from "./components/AnnotatedPapersChapter";

export default function Home() {
  return (
    <main className="page">
      <Hero />
      <SystemChapter />
      <ReviewerChapter />
      <ResultsChapter />
      <FindingChapter />
      <AnnotatedPapersChapter />
    </main>
  );
}
