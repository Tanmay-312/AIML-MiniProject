import { useState } from 'react';
import axios from 'axios';

function App() {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', { input: userInput });
      setResult(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ height:"100vh"}}>
      <div style={{ justifyContent:"center",border:"1px solid black",top:'0px',margin:'0px', padding:'5px',display:"flex"}}><h1>Sentiment Analysis</h1></div>
      <div style={{gap:"60px",width:"500px",margin:"10px auto " ,borderRadius:"12px", backgroundColor:'black',height:"300px",display:"flex",flexDirection:"column"}}>
      <form onSubmit={handleSubmit} style={{display:"flex",justifyContent:"center",flexDirection:"column",gap:"12px"}}>
        <input
        style={{margin:"12px",padding:"12px",fontSize:"larger", borderRadius:"12px"}}
          type="text"
          value={userInput}
          placeholder='Give your text here'
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit" style={{padding:"12px",borderRadius:"12px", backgroundColor:"red",fontSize:"larger",margin:"12px",fontFamily:"sans-serif",fontWeight:"700"}}>Process</button>
      </form>
      {result && <p style={{color:"white", padding:"2px",width:"100%",justifyContent:"center",display:"flex",fontSize:"x-large"}}>Result: {result}</p>}

      </div>
    </div>
  );
}

export default App;