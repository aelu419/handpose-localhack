//import logo from './logo.svg';


import React, { useRef, useEffect } from "react";

import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import './App.css';
//hand recognition from webcam
import {Camera} from '@mediapipe/camera_utils/camera_utils';
import {Hands} from '@mediapipe/hands/hands';
//tfjs model
//import * as handpose from "@tensorflow-models/handpose";
//display
import {displayHand, displayEmpty} from './displayUtils';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  window.webcamEl = null;
  window.recognizer = null;

  //called when image from webcam is successfully sent to the mediapipe hands model
  const onResults = async (results) => {
    if (results !== null){
      //results is a canvas
      //console.log(results);
    }

    const ctx = canvasRef.current.getContext("2d");
    const canvas = canvasRef.current;
    
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //results are non-empty
    if (results.multiHandLandmarks && results.multiHandedness) {
      //console.log(results);
      for (let i = 0; i < results.multiHandLandmarks.length; i++){
        displayHand(
          results.image, 
          results.multiHandedness[i],
          results.multiHandLandmarks[i],
          ctx
          );
      }
    }
    //empty results
    else {
      displayEmpty(ctx);
    }
    ctx.restore();
  }

  //called to send picture to hands
  const sendPicture = async (hands) => {
    //validate videofeed
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {

      window.webcamEl = webcamRef.current.video

      const video = webcamRef.current.video;
      const vw = webcamRef.current.video.videoWidth;
      const vh = webcamRef.current.video.videoHeight;

      video.width = vw;
      video.height = vh;

      canvasRef.current.width = vw;
      canvasRef.current.height = vh;

      /*
      const hand = await net.estimateHands(video);
      console.log(hand);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          console.log(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          console.log(gesture, gesture.gestures[maxConfidence].name);
        }
      }*/
      
      if (cam === null){
        console.log('setting up mediapipe camera for the first time');
        cam = new Camera(video, {
          onFrame: async () => {
            window.current_screenshot = video;
            await hands.send({image: video});
          },
          width:640,
          height:480
        });
        cam.start();
      }
    }
  }

  //initialize camera, will be filled when page loaded
  var cam = null;

  const setupWidgets = async () => {
    //const net = await handpose.load();
    console.log('setting up widgets');

    //initialize mediapipe ML model
    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
      maxNumHands:1,
      minDetectionConfidence:0.8,
      minTrackingConfidence:0.8
    });
    hands.onResults(onResults);

    //initialize custom hand recognizer
    window.recognizer = await tf.loadLayersModel(
      'https://aelu419.github.io/TensorFlowPlayground/asl_cnn/model.json'
    );
    window.recognizer.add(tf.layers.softmax());
    console.log(window.recognizer);

    //automatically send webcam picture to hands
    const refresh = () => {
      //console.log('refresh called');
      sendPicture(hands);
    }
    setInterval(refresh, 1000);
  }

  useEffect(()=>{setupWidgets()},[]);
  //setupWidgets();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
