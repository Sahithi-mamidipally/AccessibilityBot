import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import botImage from "./assets/bot.jpeg";
import homeIcon from "./assets/icons8-home-52.png";
import helpIcon from "./assets/icons8-help-50.png";
import zoomInIcon from "./assets/icons8-zoom-in-48.png";
import zoomOutIcon from "./assets/icons8-zoom-out-50.png";
import accountIcon from "./assets/icons8-account-50.png";
import uploadIcon from "./assets/icons8-upload-48.png";
import voiceIcon from "./assets/icons8-microphone-48.png";
import sendIcon from "./assets/icons8-send-48.png";
import cancelIcon from "./assets/icons8-cancel-24.png";
import nightModeIcon from "./assets/icons8-night-mode-50.png";
import brightModeIcon from "./assets/icons8-bright-button-48.png";
import logoutIcon from "./assets/icons8-logout-50.png";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ showSidebar }) => {
  const [isNightMode, setIsNightMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [chatMessage, setChatMessage] = useState(""); // Chat input message state
  const [isRecording, setIsRecording] = useState(false); // Voice recording state
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Toggle Night/Bright Mode
  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  // Zoom functions
  const handleZoomIn = () => {
    if (zoomLevel < 100) setZoomLevel((prevZoom) => prevZoom + 5);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) setZoomLevel((prevZoom) => prevZoom - 5);
  };

  // Dropdown functions
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleAccountDropdown = () =>
    setIsAccountDropdownOpen(!isAccountDropdownOpen);

  // File upload handling
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleUploadIconClick = () => {
    fileInputRef.current.click();
  };

  // Cancel file upload
  const handleCancelUpload = () => {
    setFileName(""); // Clear file name
    fileInputRef.current.value = ""; // Reset file input
  };

  // Voice recognition handling using Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser. Please try using Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setChatMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Send message handler
  const handleSendMessage = () => {
    if (chatMessage.trim() === "") {
      alert("Please enter or say something!");
      return;
    }
    console.log("Message sent:", chatMessage);
    // Logic to send the message to the bot can be added here
    setChatMessage(""); // Clear message after sending
  };

  // Logout function
  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const handleWindowBlur = () => {
      if (isDropdownOpen || isAccountDropdownOpen) {
        setIsDropdownOpen(false);
        setIsAccountDropdownOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (isDropdownOpen || isAccountDropdownOpen) {
        if (
          !e.target.closest(".zoom-dropdown-content") &&
          !e.target.closest(".account-dropdown") &&
          !e.target.closest(".zoom-dropdown") &&
          !e.target.closest(".nav-item")
        ) {
          setIsDropdownOpen(false);
          setIsAccountDropdownOpen(false);
        }
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen, isAccountDropdownOpen]);

  return (
    <div
      className={`dashboard ${isNightMode ? "night-mode" : "bright-mode"} ${
        showSidebar ? "sidebar-active" : ""
      }`}
      style={{
        fontSize: `${zoomLevel}%`,
        transform: `scale(${zoomLevel / 100})`,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Navigation Bar */}
      <div className="navbar" style={{ fontSize: `${zoomLevel * 1.0}rem` }}>
        <img src={botImage} alt="Bot Logo" className="bot-logo" />
        <div className="nav-items">
          <div className="nav-item active">
            <img src={homeIcon} alt="Home" className="nav-icon" />
            HOME
          </div>
          <div className="nav-item" onClick={() => navigate("/help")}>
            <img src={helpIcon} alt="Help" className="nav-icon" />
            HELP
          </div>

          {/* Text Magnification with Dropdown */}
          <div className="nav-item zoom-dropdown" onClick={toggleDropdown}>
            <img
              src={zoomInIcon}
              alt="Text Magnification"
              className="nav-icon"
            />
            Text Magnification
            {isDropdownOpen && (
              <div className="zoom-dropdown-content">
                <div onClick={handleZoomIn}>
                  <img src={zoomInIcon} alt="Zoom In" className="zoom-icon" />{" "}
                  Zoom In
                </div>
                <div onClick={handleZoomOut}>
                  <img src={zoomOutIcon} alt="Zoom Out" className="zoom-icon" />{" "}
                  Zoom Out
                </div>
              </div>
            )}
          </div>

          {/* Bright/Night Mode Toggle */}
          <div className="nav-item" onClick={toggleNightMode}>
            <img
              src={isNightMode ? nightModeIcon : brightModeIcon}
              alt={isNightMode ? "Night Mode" : "Bright Mode"}
              className="nav-icon"
            />
            {isNightMode ? "NIGHT MODE" : "BRIGHT MODE"}
          </div>

          {/* Account Dropdown */}
          <div className="nav-item" onClick={toggleAccountDropdown}>
            <img src={accountIcon} alt="Your Account" className="nav-icon" />
            YOUR ACCOUNT
            {isAccountDropdownOpen && (
              <div className="account-dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/view-account")}
                >
                  View Account Info
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/change-password")}
                >
                  Change Password
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/delete-account")}
                >
                  Delete My Account
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="nav-item" onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout" className="nav-icon" />
            LOGOUT
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="sidebar" style={{ fontSize: `${zoomLevel * 1.0}rem` }}>
          <ul>
            <li onClick={() => navigate("/text-to-speech")}>Text to Speech</li>
            <li onClick={() => navigate("/speech-to-text")}>Speech to Text</li>
            <li>Image to Text</li>
            <li>Summarize the Text</li>
            <li
              onClick={() =>
                (window.location.href = "https://ml-bot.vercel.app/")
              }
            >
              MultiLanguage
            </li>

            <li>Paraphrase or Simple Text</li>
            <li>Word Dictionary: Look up words</li>
          </ul>
        </div>
      )}

      {/* Main Chat Input Area */}
      <div
        className="chat-input-box-container"
        style={{ fontSize: `${zoomLevel * 1.0}rem`, maxHeight: "15%" }}
      >
        <div className="chat-input-box">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <button
            className="icon-btn upload-btn"
            onClick={handleUploadIconClick}
          >
            <img src={uploadIcon} alt="Upload File" />
          </button>
          <input
            type="text"
            placeholder="Message the bot and chat here"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button className="icon-btn voice-btn" onClick={handleVoiceInput}>
            <img src={voiceIcon} alt="Voice Message" />
          </button>
          <button className="icon-btn send-btn" onClick={handleSendMessage}>
            <img src={sendIcon} alt="Send Message" />
          </button>
        </div>

        {/* Cancel upload and show file name */}
        {fileName && (
          <div>
            <p>Uploaded file: {fileName}</p>
            <button
              className="icon-btn cancel-btn"
              onClick={handleCancelUpload}
            >
              <img src={cancelIcon} alt="Cancel Upload" />
            </button>
          </div>
        )}

        {isRecording && <p>Recording voice...</p>}
      </div>
    </div>
  );
};

export default Dashboard;
