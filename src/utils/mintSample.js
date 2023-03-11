import axios from 'axios';

const delay = ms => new Promise(res => setTimeout(res, ms));

export const mintSample = async (sample) => {
    try{
        // login to get jwt
        const login = await axios.post(process.env.REACT_APP_MURMUR_LOGIN, {"username": process.env.REACT_APP_JWT_USER, "password": process.env.REACT_APP_JWT_PASSWORD}, 
        { headers: { 'Content-Type': 'application/json' } } )
        
        const jwt = login.data.jwt
        
        // cut sample
        const path = process.env.REACT_APP_UPLOAD_PATH + sample.file;
        

        const sampleCut = {
            filePath: path, 
            index: sample.index,
            start: sample.start,
            end: sample.end
        }

        const data = [{
            sample: [
              sampleCut,
            ]
          }]

        const cutSample = await axios.post(process.env.REACT_APP_MURMUR_API + '/v1/media/samples/create', data, {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        }) ;

        await delay(20000);
        

        const finalSample = {
            title: sample.title,
            description: sample.description, 
            file: sample.file, 
            tablelandPackId: sample.tablelandPackId,
            tablelandVideoId: sample.tablelandVideoId,
            video_id: sample.video_id,
            pack_id: sample.pack_id,
            start_time: sample.start_time, 
            end_time: sample.end_time, 
            duration: sample.duration, 
            path: sample.path,
            index: sample.index
        }

        const sampleData = [
            finalSample
        ]

        const mintSample = await axios.post(process.env.REACT_APP_MURMUR_API + '/v1/media/samples/nft', sampleData, {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        });

        return {
            success: true,
            message: mintSample
        }

    } catch (err){
        console.log(err)
        return {
            success: false, 
            message: err
        }
    }


}