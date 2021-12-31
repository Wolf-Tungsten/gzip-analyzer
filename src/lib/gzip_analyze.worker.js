import fstream from './fstream'
import { open, inflate } from './inflate'

const res = []

onmessage = (e) => {

    if(e.data.type === 'OPEN_FILE'){
        open(e.data.payload)
        inflate(res)
        postMessage({type:"INFLATE_RESULT", payload:res})
        if(fstream.eof()){
            postMessage({type:"INFLATE_DONE"}) 
        }
    } else if (e.data.type === 'LOAD_MORE'){
        inflate(res)
        postMessage({type:"INFLATE_RESULT", payload:res})
        if(fstream.eof()){
            postMessage({type:"INFLATE_DONE"}) 
        }
    }

}