import wolfFunc from './func_in_work'

onmessage = (e) => {
    wolfFunc(e)
    postMessage('wolf wolf wolf')
}