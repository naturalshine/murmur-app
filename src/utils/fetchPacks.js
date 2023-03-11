import axios from 'axios';

export const fetchPacks = async () => {
    try{
        // login to get jwt
        
        const login = await axios.post(process.env.REACT_APP_MURMUR_LOGIN, {"username": process.env.REACT_APP_JWT_USER, "password": process.env.REACT_APP_JWT_PASSWORD}, 
        { headers: { 'Content-Type': 'application/json' } } )
        
        const jwt = login.data.jwt
        
        // fetch videos

        const res = await axios.get(process.env.REACT_APP_MURMUR_API + '/v1/media/packs', {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        }) ;

        return {
            packs: res.data.messages
        }

    } catch (err){
        console.log(err)
        return {
            success: false, 
            message: err
        }
    }


}