import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Audio from './pages/Audio';
import Packs from './pages/Packs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path='/'  element={<Home />} exact />
				<Route path='/audio'  element={<Audio />} exact />
				<Route path='/packs'  element={<Packs />} exact />

			</Routes>
			<Footer />
		</Router>
	);
};

export default App;
