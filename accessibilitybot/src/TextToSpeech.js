import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaTimes } from 'react-icons/fa'; // Import icons for play, pause, and clear
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [text, setText] = useState(''); // Store the input text
  const [isSpeaking, setIsSpeaking] = useState(false); // Manage speaking state
  const [isPaused, setIsPaused] = useState(false); // Manage pause/resume state
  const [volume, setVolume] = useState(1); // Volume control (1 = 100%)
  const [utterance, setUtterance] = useState(null); // Current speech utterance
  const [uploadedFileName, setUploadedFileName] = useState(''); // Store the file name
  const [speechSynthesisInstance] = useState(window.speechSynthesis);
  const [fileInputKey, setFileInputKey] = useState(''); // Track key for resetting file input

  // Apply volume change on the utterance when volume is adjusted
  useEffect(() => {
    if (utterance && isSpeaking) {
      utterance.volume = volume; // Ensure the volume is updated for the current utterance
    }
  }, [volume, utterance, isSpeaking]);

  // Handle the text input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle file upload and set the file text to the input field
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setText(event.target.result); // Display file content in the textarea
        setUploadedFileName(file.name); // Display the file name
      };
      reader.readAsText(file);
    }
  };

  // Clear the uploaded file and reset the file input
  const handleClearFile = () => {
    setUploadedFileName(''); // Remove the file name display
    setText(''); // Clear the text from the text box too
    setFileInputKey(Date.now()); // Reset file input by changing its key
  };

  // Start speech synthesis
  const handleSpeak = () => {
    if (text.trim() === '') {
      alert('Please enter text or upload a file.');
      return;
    }

    // Stop any previous utterances
    speechSynthesisInstance.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.volume = volume;

    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false); // Reset the paused state when speech ends
    };

    setUtterance(newUtterance);
    speechSynthesisInstance.speak(newUtterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  // Toggle between pause and resume
  const handleTogglePauseResume = () => {
    if (isPaused) {
      // Resume speech
      speechSynthesisInstance.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      // Pause speech
      speechSynthesisInstance.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  // Stop/cancel speech synthesis
  const handleStop = () => {
    speechSynthesisInstance.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Clear the text
  const handleClearText = () => {
    setText('');
    handleStop();
  };

  // Adjust volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume); // Set volume for new utterances
  };

  return (
    <div className="text-to-speech-container">
      <div className="textarea-container">
        <textarea
          className="text-box"
          placeholder="Enter text here"
          value={text}
          onChange={handleTextChange}
        />
        {text && (
          <FaTimes className="clear-text" onClick={handleClearText} />
        )}
      </div>

      {/* Display the uploaded file name with an "X" button to clear */}
      {uploadedFileName && (
        <div className="file-info">
          <span>{uploadedFileName}</span>
          <FaTimes className="clear-file" onClick={handleClearFile} />
        </div>
      )}

      <div className="upload-container">
        {/* Reset the file input by updating the key */}
        <input
          key={fileInputKey} // Add key to reset input on file clear
          type="file"
          onChange={handleFileUpload}
          accept=".txt"
        />
      </div>

      <div className="controls">
        <button onClick={handleSpeak} disabled={isSpeaking && !isPaused}>Convert to Speech</button>

        {/* Show either Pause or Play/Resume icon based on the speaking state */}
        {isSpeaking || isPaused ? (
          <button onClick={handleTogglePauseResume}>
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
        ) : null}

        <button onClick={handleStop}>Stop</button>
      </div>

      <div className="volume-control">
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default TextToSpeech;