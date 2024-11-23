import { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null);
  const [positive, setPositive] = useState(0);
  const [negative, setNegative] = useState(0);
  const [logs, setLogs] = useState([]); // Store logs here

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPositive(0);
    setNegative(0);
    setLogs([]); // Clear logs on new submission

    const sentences = userInput.split('.');
    sentences.pop();
    let posCount = 0;
    let negCount = 0;

    for (const sentence of sentences) {
      const isPositive = await calculate(sentence.trim());
      if (isPositive) {
        posCount += 1;
      } else {
        negCount += 1;
      }
    }
    console.log(logs)
    setPositive(posCount);
    setNegative(negCount);
    setResult(`Positive: ${posCount} || Negative: ${negCount} || Result: ${posCount>negCount?'Non-Racist/sexist':'Racist/sexist'}`);
  };

  const calculate = async (val) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', { input: val });
      let ans=response.data.result;
      console.log(ans);
      setLogs((prevLogs) => [...prevLogs, { val, result: ans }]); // Add to logs
      return ans;
    } catch (error) {
      console.error(error);
      setLogs((prevLogs) => [...prevLogs, { val, result: 'Error' }]); // Handle error
      return false;
    }
  };

  const data = {
    labels: ['Non-Sexist/Racist', 'Sexist/Racist'],
    datasets: [
      {
        label: 'Comment Analysis',
        data: [positive, negative],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sentiment Analysis Results',
      },
    },
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", height: "100vh", backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>
        <header style={{ backgroundColor: "#6200ea", color: "#fff", padding: "16px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>Sentiment Analysis Tool</h1>
        </header>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'row', height: '100%', gap: '62px' }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", width: '45%', margin: '88px 0px' }}>
            <textarea
              style={{
                padding: "12px 16px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
                transition: "border-color 0.3s",
                height: '450px',
                resize: 'none',
                minWidth: '100%',
              }}
              value={userInput}
              placeholder="Enter text for analysis"
              onFocus={(e) => (e.target.style.borderColor = "#6200ea")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              type="submit"
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#6200ea",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s",
                border: "none",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#5a00d1")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#6200ea")}
            >
              Analyze
            </button>
            {result && (
            <div style={{ marginTop: "20px", textAlign: "center", color: "#333", fontSize: "22px", fontWeight: "700" }}>
              {result}
            </div>
          )}
          </form>

          

          <div style={{ marginTop: "40px", width: "50%", padding: "0 20px" }}>
            <Bar data={data} options={options} />
            {logs.length > 0 && (
              <div style={{ marginTop: "20px", fontSize: "14px", fontWeight: "400", color: "#333" ,overflow:'scroll', border: '2px solid black',padding: '5px', borderRadius: '12px',height:'180px'}}>
                <h2>Logs:</h2>
                <ul>
                  {logs.map((log, index) => (
                    <li key={index}>
                      <strong>Sentence:</strong> {log.val} <br />
                      <strong>Result:</strong> {log.result?'Non-Racist/sexist':'Racist/sexist'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
