export default function ScoreBar({ score }: { score: number }) {
  return (
    <div className="mb-4 text-center">
      ⭐ Score: {score}
    </div>
  );
}