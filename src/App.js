import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Audio from './pages/Audio';
import Packs from './pages/Packs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { connectWallet, getCurrentWalletConnected } from "./utils/handleWallet"

const App = () => {
	const [walletAddress, setWallet] = useState("");
	const [status, setStatus] = useState("");

	useEffect(async () => {
		const {address, status} = await getCurrentWalletConnected();
		setWallet(address)
		setStatus(status)
	
		addWalletListener(); 
	
	  }, []);
	
	  const connectWalletPressed = async () => {
		console.log("CLICK!")
		const walletResponse = await connectWallet();
		setStatus(walletResponse.status);
		setWallet(walletResponse.address);
	  };
	
	  function addWalletListener() {
		if (window.ethereum) {
		  window.ethereum.on("accountsChanged", (accounts) => {
			if (accounts.length > 0) {
			  setWallet(accounts[0]);
			}
		  });
		} else {
		  setStatus(
			<h1>
			  🦊
			  <a target="_blank" href={`https://metamask.io/download.html`}>
				You must be connected to the Ethereum network to continue. One way to do this is to install Metamask, a virtual Ethereum wallet, in your
				browser. 
			  </a>
			</h1>
		  );
		}
	  }
	

	return (
		<Router>

			<Navbar />

			<button id="walletButton" onClick={connectWalletPressed}>
				{walletAddress.length > 0 ? (
				"Connected: " +
				String(walletAddress).substring(0, 6) +
				"..." +
				String(walletAddress).substring(38)
				) : (
				<span>Connect Wallet</span>
				)}
			</button>
			<h2>{status}</h2>
			
			<Routes>
				<Route path='/'  element={<Home walletAddress={walletAddress}/>} exact />
				<Route path='/audio'  element={<Audio walletAddress={walletAddress}/>} exact />
				<Route path='/packs'  element={<Packs walletAddress={walletAddress}/>} exact />

			</Routes>

			<Footer />
		</Router>
	);
};

export default App;
