import { useContext } from "react";
import AudioWaveform from '../components/AudioWaveform';
import { FileContext } from '../contexts/fileContext';


const Packs = () => {
	const { fileURL, setFileURL } = useContext(FileContext);

	return (
		<div>
			<h1>Sample Packs</h1>
		</div>
	);
};

export default Packs;