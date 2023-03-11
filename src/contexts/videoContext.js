import React, { createContext, useState } from 'react';

const VideoContext = createContext();

const VideoContextProvider = ({ children }) => {
	const [videoId, setVideoId] = useState('');
    const [tablelandVideoId, setTablelandVideoId] = useState('');
    const [samplePackId, setSamplePackId] = useState('');
    const [tablelandSamplePackId, setTablelandSamplePackId] = useState('')

	return (
		<VideoContext.Provider value={{ 
                                        videoId, setVideoId,
                                        tablelandVideoId, setTablelandVideoId,
                                        samplePackId, setSamplePackId,
                                        tablelandSamplePackId, setTablelandSamplePackId
                                    }}>
			{children}
		</VideoContext.Provider>
	);
};

export { VideoContext, VideoContextProvider };
