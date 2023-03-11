import { useContext } from "react";
import AudioWaveform from '../components/AudioWaveform';
import { FileContext } from '../contexts/fileContext';
import { VideoContext } from '../contexts/videoContext'


const Packs = () => {
	const { fileURL, setFileURL } = useContext(FileContext);
    const { videoId, setVideoId } = useContext(VideoContext);

	return (
		<div>
			<h1>Sample Packs</h1>
		</div>
	);
};

export default Packs;