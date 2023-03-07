import { useContext } from "react";
import AudioWaveform from '../components/AudioWaveform';
import { FileContext } from '../contexts/fileContext';


const Audio = () => {
	const { fileURL, setFileURL } = useContext(FileContext);

	return (
		<div>
			<AudioWaveform />
		</div>
	);
};

export default Audio;