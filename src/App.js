import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./App.css";
import Logo from "./logo.png";
import Healthy from "./check.png";
import Unhealthy from "./unhealthy.png";

function App() {
  const baseUrl = "http://127.0.0.1:8000";
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [testResult, setTestResult] = useState("");
  const testType = "X-ray";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setTestResult("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("testType", testType);
    formData.append("date", date.toISOString());
    formData.append("image", image);

    try {
      const response = await axios.post(`${baseUrl}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTestResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setTestResult("Error occurred while making the request.");
    }
  };

  return (
    <div className="container">
      <div className="logoContainer m-5">
        <img src={Logo} alt="Logo" />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Test Type:</Form.Label>
          <Form.Control type="text" value={testType} readOnly />
        </Form.Group>
        <Form.Group>
          <Form.Label>Date:</Form.Label>
          <DatePicker
            showIcon
            selected={date}
            onChange={(newDate) => setDate(newDate)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 48 48"
              >
                <mask id="ipSApplication0">
                  <g
                    fill="none"
                    stroke="#fff"
                    strokeLinejoin="round"
                    strokeWidth="4"
                  >
                    <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                    <path
                      fill="#fff"
                      d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                    ></path>
                  </g>
                </mask>
                <path
                  fill="currentColor"
                  d="M0 0h48v48H0z"
                  mask="url(#ipSApplication0)"
                ></path>
              </svg>
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Upload Image:</Form.Label>
          <Form.Control
            id="selectedFile"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="submitBtn mt-4 mb-4 w-100"
          id="submitBtn"
        >
          Submit
        </Button>
      </Form>
      {testResult ? (
        <div className="resultContainer mt-3">
          <h5>Test Result:</h5>
          <div className="predictionContainer">
            <img
              src={
                testResult?.prediction?.includes("healthy")
                  ? Healthy
                  : Unhealthy
              }
              alt="result"
              className="predictionIcon"
            />
            <p
              className={
                "prediction " +
                (testResult?.prediction?.includes("healthy")
                  ? "healthy"
                  : "unhealthy")
              }
            >
              {testResult.prediction}
            </p>
          </div>
          <p className="accuracy">Accuracy: {testResult.accuracy}</p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
