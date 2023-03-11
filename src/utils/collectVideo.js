import { ethers } from 'ethers';

const contractABI = require('../abis/video-abi.json');
const contractAddress = process.env.REACT_APP_VIDEO_CONTRACT;
const infuraKey = process.env.REACT_APP_INFURA_KEY;

export const collectVideo = async(tablelandId) => {
    try{

        const { ethereum } = window;
        
        let polygonScan;

        if (ethereum) {
            console.log("CONTRACT =>", contractAddress)
            console.log("infura key =>", infuraKey)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            console.log("signer ", signer)
            const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
            //onsole.log("nftContract =>", nftContract)
            
            /*
            const transactionParameters = {
                to: contractAddress,
                from: window.ethereum.selectedAddress,
                'data': window.contract.methods.mint(tablelandId).encodeABI() 
            };
            console.log("triggering tx")
            //sign transaction via Metamask
            const txHash = await window.ethereum
                .request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });
            */
            //console.log("Initialize payment");
            let nftTxn = await nftContract.mint(tablelandId);
    
            console.log("Mining... please wait");
            await nftTxn.wait();

            polygonScan = "https://mumbai.polygonscan.com/tx/" + nftTxn.hash
            console.log(polygonScan);

    
        } else {
            console.log("Ethereum object does not exist");
            throw new Error("minting failed!")
        }
    
        return {
            success: true,
            status: polygonScan
        }

    } catch (error) {
        console.log("ERROR! =>", error)
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
       }    
    }


    
}

