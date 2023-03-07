import axios from 'axios';


export const mintSamplePack = async (image, name, description) => {
    try{
        // login to get jwt
        const login = await axios.post(process.env.REACT_APP_MURMUR_LOGIN, {"username": process.env.REACT_APP_JWT_USER, "password": process.env.REACT_APP_JWT_PASSWORD}, 
        { headers: { 'Content-Type': 'application/json' } } )
        
        const jwt = login.data.jwt
        
        const formData = new FormData();
        formData.append("file", image, image.name);
        const imageReturn = await axios.post(process.env.REACT_APP_MURMUR_API + '/v1/storage/upload', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        
        // create data
        const data = {
            title: name,
            description: description, 
            file: image.name,
            path: '/home/cst/code/murmur/murmur-api/src/resources/static/assets/uploads/'
        }

        const packReturn = await axios.post(process.env.REACT_APP_MURMUR_API + '/v1/media/packs/nft', data, {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        }) ;

        return {
            result: packReturn
        }

    } catch (err){
        console.log(err)
        return {
            success: false, 
            message: err
        }
    }


}
