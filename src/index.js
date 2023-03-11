import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { FileContextProvider } from './contexts/fileContext';
import { VideoContextProvider } from './contexts/videoContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.REACT_APP_LIVEPEER_API_KEY,
  }),
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FileContextProvider>
  <VideoContextProvider>
  <LivepeerConfig client={livepeerClient}>
    <App />
  </LivepeerConfig>
  </VideoContextProvider>
  </FileContextProvider>
);
