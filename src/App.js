import { useState, useRef } from 'react';
import preprocessImage from './preprocess';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  // const [pin, setPin] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
 
  const handleChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]))
    // setImage(`${window.location.origin}/${event.target.files[0].name}`);
    // const image = preprocessImage(canvasObj, event.target.files[0]);
  }

  const handleClick = () => {
    
    const canvas = canvasRef.current;
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageRef.current, 0, 0);
    ctx.putImageData(preprocessImage(canvas),0,0);
    const dataUrl = canvas.toDataURL("image/jpeg");
  
    Tesseract.recognize(
      dataUrl,'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.error(err);
    })
    .then(result => {
      // Get Confidence score
      let confidence = result.confidence
      // Get full output
      let text = result.text
  
      setText(text);
      // setPin(patterns);
    })
  }

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <img 
           src={image} className="App-logo" alt="logo"
           ref={imageRef} 
           />
        <h3>Canvas</h3>
        <canvas ref={canvasRef} width={700} height={300}></canvas>
          <h3>Extracted text</h3>
        <div className="pin-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{height:50}}>Convert to text</button>
      </main>
    </div>
  );
}

export default App