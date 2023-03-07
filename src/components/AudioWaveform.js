import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import wavesurfer from 'wavesurfer.js';
import MarkersPlugin from 'wavesurfer.js/src/plugin/markers/index.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ClearIcon from '@mui/icons-material/Clear';

import Button from 'react-bootstrap/Button';

import { FileContext } from '../contexts/fileContext';
import { mintSamplePack } from '../utils/mintSamplePack';
import { mintSample } from '../utils/mintSample';

const AudioWaveform = () => {
	const navigate = useNavigate();

	const wavesurferRef = useRef(null);
	const timelineRef = useRef(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const [samplePackName, setSamplePackName] = useState("New Sample Pack");
	const [samplePackDescription, setSamplePackDescription] = useState("Description");
	const [status, setStatus] = useState('');
	// fetch file url from the context
	const { fileURL, setFileURL } = useContext(FileContext);
	

	const handleSamplePackName = event => {
		setSamplePackName(event.target.value);
	  };

	const handleSamplePackDescription = event => {
		setSamplePackDescription(event.target.value);
	  };
	

	// crate an instance of the wavesurfer
	const [wavesurferObj, setWavesurferObj] = useState();

	const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
	const [volume, setVolume] = useState(1); // to control volume level of the audio. 0-mute, 1-max
	const [zoom, setZoom] = useState(1); // to control the zoom level of the waveform
	const [duration, setDuration] = useState(0); // duration is used to set the default region of selection for trimming the audio
	const [samples, setSamples] = useState([])
	
	
	// create the waveform inside the correct component
	useEffect(() => {
		if (wavesurferRef.current && !wavesurferObj) {
			setWavesurferObj(
				wavesurfer.create({
					container: '#waveform',
					scrollParent: true,
					autoCenter: true,
					cursorColor: '#00ff00',
					loopSelection: true,
					waveColor: '#66ff66',
					progressColor: '#00ff00',
					responsive: true,
					plugins: [
						TimelinePlugin.create({
							container: '#wave-timeline',
						}),
						RegionsPlugin.create({}),
						MarkersPlugin.create({}),
					],
				})
			);
		}
	}, [wavesurferRef, wavesurferObj]);

	// once the file URL is ready, load the file to produce the waveform
	useEffect(() => {

		if (fileURL && wavesurferObj) {
			wavesurferObj.load(fileURL);

		}
	}, [fileURL, wavesurferObj]);

	useEffect(() => {
		if (wavesurferObj) {
			// once the waveform is ready, play the audio
			wavesurferObj.on('ready', () => {
				wavesurferObj.play();
				wavesurferObj.enableDragSelection({}); // to select the region to be trimmed
				setDuration(Math.floor(wavesurferObj.getDuration())); // set the duration in local state
			});

			// once audio starts playing, set the state variable to true
			wavesurferObj.on('play', () => {
				setPlaying(true);
			});

			// once audio starts playing, set the state variable to false
			wavesurferObj.on('finish', () => {
				setPlaying(false);
			});

			// if multiple regions are created, then remove all the previous regions so that only 1 is present at any given time
			wavesurferObj.on('region-updated', (region) => {
				const regions = region.wavesurfer.regions.list;
				const keys = Object.keys(regions);
				if (keys.length > 1) {
					regions[keys[0]].remove();
				}
			});
		}
	}, [wavesurferObj]);

	// set volume of the wavesurfer object, whenever volume variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.setVolume(volume);
	}, [volume, wavesurferObj]);

	// set zoom level of the wavesurfer object, whenever the zoom variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.zoom(zoom);
	}, [zoom, wavesurferObj]);

	// when the duration of the audio is available, set the length of the region depending on it, so as to not exceed the total lenght of the audio
	useEffect(() => {
		if (duration && wavesurferObj) {
			// add a region with default length
			wavesurferObj.addRegion({
				start: Math.floor(duration / 2) - Math.floor(duration) / 5, // time in seconds
				end: Math.floor(duration / 2), // time in seconds
				color: 'rgba(0, 255, 0, 0.2)', // color of the selected region, light hue of purple
			});
		}
	}, [duration, wavesurferObj]);

	const handlePlayPause = (e) => {
		wavesurferObj.playPause();
		setPlaying(!playing);
	};

	const handleSample = (e) => {
		if (wavesurferObj) {
			// get start and end points of the selected region
			const region =
				wavesurferObj.regions.list[
					Object.keys(wavesurferObj.regions.list)
				];

			if (region) {
				const start = region.start;
				const end = region.end;
				const newSample = {index: samples.length, start: region.start, end: region.end}

				samples.push(newSample)


				//const startSeconds = Math.floor(duration / 2) - Math.floor(duration) / 5;
				//const endSeconds = Math.floor(duration / 2)
				const startSeconds = start;
				const endSeconds = end;

				if (duration && wavesurferObj) {
					// add a region with default length
					wavesurferObj.addRegion({
						start: startSeconds, // time in seconds
						end: endSeconds, // time in seconds
						color: 'rgba(0, 255, 0, 0.2)', // color of the selected region, light hue of purple
					});

					var randomColor = Math.floor(Math.random()*16777215).toString(16);

					wavesurferObj.addMarker({
						time: startSeconds, 
						label: (samples.length).toString(),
						color: "#" + randomColor,
					});

					wavesurferObj.addMarker({
						time: endSeconds, 
						color: "#" + randomColor,
					})

				}


			}
		}
	};

	const clearMarkers = (e) => {
		wavesurferObj.markers.clear();
		setSamples([]);
	}

	const handleSubmit = async() => {
		setStatus("Creating Sample Pack...")
		const createSampleNft = await mintSamplePack(selectedImage, samplePackName, samplePackDescription);
		
		for (const sample of samples) {
			sample.start = Math.round( sample.start );
			sample.end = Math.round( sample.end );
			sample.packId = createSampleNft.result.data.message[0].id;
			sample.videoId = 4;
			sample.tablelandPackId = createSampleNft.result.data.message[0].id;
			sample.tablelandVideoId = createSampleNft.result.data.message[0].id;
			sample.title = samplePackName + " " + sample.index.toString();
			sample.description = samplePackDescription;
			sample.start_time = sample.start.toString();
			sample.end_time = sample.end.toString();
			const duration = sample.end - sample.start
			sample.duration = duration.toString();
			sample.file = selectedImage.name;
			const sampleReturn = await mintSample(sample);
		}
		setStatus('Done creating samples');
		console.log("ALL DONE");

		navigate("/packs");
		
	}

	return (
		<section className='waveform-container'>
			<h1 style={{ textAlign: 'center', margin: '1em 0' }}>
				{samplePackName}
				<Button type="submit" onClick={handleSubmit}>Mint Pack</Button>

			</h1>
			<h2 style={{ textAlign: 'center', margin: '1em 0' }}>{status}</h2>

			{selectedImage && (
				<div className="image-container">
					<img className="selected-image"
						alt="not found"
						width={"250px"}
						src={URL.createObjectURL(selectedImage)}
					/>
					</div>
				)}

			<div className='data-container'>

				<input type="text" value={samplePackName} onChange={handleSamplePackName} />

				<input type="text" value={samplePackDescription} onChange={handleSamplePackDescription} />
				<input
					type="file"
					name="myImage"
					onChange={(event) => {
					setSelectedImage(event.target.files[0]);
					}}
				/>


			</div>
			<div className='all-controls'>
				<div className='left-container'>
					<button
						title='play/pause'
						className='controls'
						onClick={handlePlayPause}>
						{playing ? (
							<PauseIcon></PauseIcon>
						) : (
							<PlayArrowIcon></PlayArrowIcon>
						)}
					</button>
					<button className='trim' onClick={handleSample}>
						<ContentCutIcon>
						</ContentCutIcon> Sample
					</button>

					<button className='clear' onClick={clearMarkers}>
						<ClearIcon>
						</ClearIcon>Reset
					</button>
				</div>
			</div>
			<div ref={wavesurferRef} id='waveform' />
			<div ref={timelineRef} id='wave-timeline' />	
	  </section>
	);
};

export default AudioWaveform;
