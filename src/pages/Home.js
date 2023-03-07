import { Player } from "@livepeer/react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import mux from "mux-embed";
import { useCallback, useEffect, useContext, useState } from "react";
import { FileContext } from '../contexts/fileContext';

import { fetchVideos } from "../utils/fetchVideos";


const Home = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [playerRef, setPlayerRef] = useState();
  const [video, setVideo ] = useState('');
  const [audio, setAudio ] = useState('');

	const { fileURL, setFileURL } = useContext(FileContext);

  const navigate = useNavigate();
  const audioPage = () => {
      navigate("/audio");
  }

  const handleCollect = async () => {
    console.log("Collecting....");
  }

  const getVideos = async () => {
    const results = await fetchVideos();
    console.log("AUDIO =>", results.videos[0].audio)
    const audioHash = 'bafybeiariunfq7wi77df4k5iocdmk3it22rlip5jzmigv2dzhn2k2djjkm'
    const audioUrl = "https://" + audioHash + '.ipfs.w3s.link/'
    //const hash = audioHash.replace(/^ipfs?:\/\//, '')
    //const audioUrl = URL + hash
    return [results, audioUrl]
  }

  useEffect(() => {
      getVideos().then((res) => {
        console.log("FRONT END RESULTS =>", res[0]);
        setVideo(res[0].videos[0].video);
        console.log(video);
        setUrl('ipfs://bafybeic7qz4n3dtk6jpede5za5w2zlir3fberdt5zxb3bskytfo266sbcu');
        setTitle(res[0].videos[0].title);
        console.log("AUDIO URL =>", res[1]);
        setAudio(res[1])
        const localAudio = URL.createObjectURL(new Blob([res[1]], {type: "audio/wav"}));
        console.log("LOCAL AUDIO =>", localAudio);
        setFileURL(res[1]);

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

        </div>
      </div>
            
    </div>
  );
}

export default Home;