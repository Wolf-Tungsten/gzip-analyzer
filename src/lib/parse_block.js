import fstream from './fstream'
import buildHuffmanTree from './huffman'
const parseNoCompressionBlock = (res) => {
    res.blockType = 'No Compression'
    console.log('No Compression')
}

const parseFixedHuffmanBlock = (res) => {
    res.blockType= 'Fixed Huffman Block'
    console.log('Fixed Huffman')
}

const parseDynamicHuffmanBlock = (res) => {
    res.blockType = 'Dynamic Huffman Block'
    console.log('Dynamic Huffman')
    res.HLIT = fstream.getUintOf(5) + 257
    res.HDIST = fstream.getUintOf(5) + 1
    res.HCLEN = fstream.getUintOf(4) + 4
    let hclenOrderMap = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    let hclenOrdered = new Array(res.HCLEN)
    hclenOrdered.fill(0, 0)
    for(let i = 0; i < res.HCLEN; i++){
        hclenOrdered[hclenOrderMap[i]] = fstream.getUintOf(3)
    }
    console.log(hclenOrdered)
    buildHuffmanTree(hclenOrdered)
}

const parseBlock = () => {
    let res = {}
    res.BFINAL = fstream.getBit()
    // for debug
    res.BFINAL = 1

    res.BTYPE = fstream.getUintOf(2)
    if(res.BTYPE === 0){
        parseNoCompressionBlock(res)
    } else if (res.BTYPE === 1){
        parseFixedHuffmanBlock(res)
    } else if (res.BTYPE === 2){
        parseDynamicHuffmanBlock(res)
    }
    return res
}

export default parseBlock