import { Player } from "@livepeer/react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import mux from "mux-embed";
import { useCallback, useEffect, useContext, useState } from "react";

import { FileContext } from '../contexts/fileContext';
import { VideoContext } from '../contexts/videoContext';

import { fetchVideos } from "../utils/fetchVideos";
import { collectVideo } from '../utils/collectVideo';


const Home = ({walletAddress}) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [playerRef, setPlayerRef] = useState();
  const [video, setVideo ] = useState('');
  const [videoTablelandId, setVideoTablelandId] = useState();
  const [status, setStatus] = useState('');
	
  const { videoId, setVideoId } = useContext(VideoContext);

	const { fileURL, setFileURL } = useContext(FileContext);

  const navigate = useNavigate();
  const audioPage = () => {
      navigate("/audio");
  }

  const handleCollect = async () => {
    console.log("Collecting....");
    setStatus("Collecting video... " + videoTablelandId.toString());
    const tokenReturn = await collectVideo(videoTablelandId);
    if(tokenReturn.success){
      setStatus("Video collected with token id: ", tokenReturn.status)
    } else {
      console.log("collecting failed")
      setStatus("Video collection failed ", tokenReturn.status)
    }
  }

  const getVideos = async () => {
    const results = await fetchVideos();
    return results
  }

  useEffect(() => {
      getVideos().then((res) => {
        console.log("FRONT END RESULTS =>", res);

        setVideo(res.videos[0].video);
        console.log("VIDEO => ", video);

        setUrl('ipfs://' + res.videos[0].video);
        setTitle(res.videos[0].title);

        setVideoTablelandId(res.videos[0].tablelandid);
        console.log("VIDEO TABLELAND ID=>", videoTablelandId);
        
        setVideoId(res.videos[0].id);
        console.log("VIDEO ID =>", videoId);
        
        //const audioUrl = "https://bafybeidqq36lb2njfhjbqj5pgmsfjv6i4jqd67ecscu5wmskg2he66wshq.ipfs.dweb.link/"
        const audioUrl = "https://" + res.videos[0].audio + '.ipfs.dweb.link/'
        console.log("AUDIO URL =>", audioUrl);

        setFileURL(audioUrl);
        const localAudio = URL.createObjectURL(new Blob([audioUrl], {type: "audio/wav"}));

        console.log("LOCAL AUDIO =>", localAudio);

      }).catch((e) => {
        console.log(e.message)
      });  
    }, []);

    console.log("FILE URL =>", fileURL)
    

  const mediaElementRef = useCallback((ref) => {
    setPlayerRef(ref);
  }, []);

  useEffect(() => {
    if (playerRef) {

      const initTime = mux.utils.now();

      mux.monitor(playerRef, {
        debug: false,
        data: {
          env_key: process.env.REACT_APP_MUX_ENV_KEY,
          player_name: "MURMUR PLAYER",
          player_init_time: initTime,
          video_id: url,
          video_title: title,
        },
      });
    }
  }, [playerRef]);

  return (
    <div>
      <div className="flex flex-col justify-center items-center h-screen font-poppins">
        <div className="mt-8 w-[90%] lg:w-[40%]">
          {url && (
            <Player
              title={title || url}
              src={url}
              autoPlay
              muted
              showPipButton
              mediaElementRef={mediaElementRef}
            />
          )}
          {loading && (
            <div className="flex flex-col justify-center mt-8 items-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#19BC75]" />
            </div>
          )}

          <Button className ="sample-btn" variant="primary" size="lg" active onClick={audioPage}>SAMPLE</Button>
          <Button className ="sample-btn" variant="primary" size="lg" active onClick={handleCollect}>COLLECT</Button>
          <h2>{status}</h2>
        </div>
      </div>
            
    </div>
  );
}

export default Home;