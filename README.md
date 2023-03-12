## MURMUR FRONTEND DEMO

MURMUR is creating technology for ASMR. This repo contains the front-end app for the Tableland Pilot Program MURMUR demo: a collectible video app that enables users to create sample packs of short ASMR clips from the videos' audio. 

This is the companion app to the [MURMUR API](https://github.com/naturalshine/murmur-api/).

## Config

See .sample.env for necessary environment variables

## Commands

`npm run start` to run the demo app

## VIDEOS

On landing, users see the available video(s). The demo app is programmed to host only one video. Its metadata is fetched from the [API](https://github.com/naturalshine/murmur-api/). The video itself is streamed via `livepeer.js` from its pinned CID on IPFS. 

Users can opt to collect the video as an NFT or create a sample pack from its audio. 

## SAMPLE PACKS AND SAMPLES

On the sample pack page, users can clip the audio from the video and add metadata about the sample pack, including a title, description, and image. Future iterations of the app will expand the metadata that's able to be added about the pack and about each individual sample. 

Once a user has clipped sound and added metadata, the sample pack and samples are minted as NFTs and returned to the frontend for confirmation. 

## TODO 
- Tests
- Full sample pack page (post-mint) that enables collection of packs
- Full metadata capability for the sample / sample pack creation process






