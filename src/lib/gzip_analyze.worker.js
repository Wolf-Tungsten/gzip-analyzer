import { exposeWorker } from 'react-hooks-worker'

const myWorker = (a) => {
    console.log(a)
    return 114
}

exposeWorker(myWorker)