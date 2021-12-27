import { inflate } from './inflate'

onmessage = (e) => {

    if(e.data.type === 'OPEN_FILE'){
        postMessage({
            type:'INFLATE_RESULT',
            payload:inflate(e.data.payload)
        })
    }

}