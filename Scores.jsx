import { useEffect, useState } from "react";

export default function Scores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/scores")
      .then(res => res.json())
      .then(data => setScores(data));
  }, []);

  return (
    <div>
      <h2>All Scores</h2>
      <ul>
        {scores.map((s, i) => (
          <li key={i}>{s.player}: {s.score}</li>
        ))}
      </ul>
    </div>
  );
}

