import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let scores = []; // لتخزين النقاط محليًا
let dailyPuzzle = { question: "Loading puzzle...", answer: "TBD" };

function generatePuzzle() {
  const numbers = Array.from({length:3}, () => Math.floor(Math.random()*10));
  dailyPuzzle.question = `What is the sum of ${numbers.join(", ")}?`;
  dailyPuzzle.answer = numbers.reduce((a,b)=>a+b,0).toString();
}

app.get('/puzzle', (req,res) => {
  generatePuzzle();
  res.json(dailyPuzzle);
});

app.post('/submit', (req,res) => {
  const { answer, player } = req.body;
  const correct = answer === dailyPuzzle.answer;

  if(correct){
    scores.push({player, score: Number(dailyPuzzle.answer)});
    res.json({correct: true, message: "Correct! Score saved locally.", scores});
  } else {
    res.json({correct: false, message: "Try again!", scores});
  }
});

app.get('/scores', (req,res) => {
  res.json(scores);
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));

