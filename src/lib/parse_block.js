import fstream from "./fstream";
import buildHuffmanTree from "./huffman";

const decodeCodeLength = (tree, num) => {
  let res = [];
  while (res.length < num) {
    let node = tree;
    while (!node.leaf) {
      if (fstream.getBit()) {
        node = node.children[1];
      } else {
        node = node.children[0];
      }
    }
    if (node.name <= 15) {
      res.push(node.name);
    } else if (node.name === 16) {
      let extra = fstream.getUintOf(2) + 3;
      for (let i = 0; i < extra; i++) {
        res.push(res[res.length - 1]);
      }
    } else if (node.name === 17) {
      let extra = fstream.getUintOf(3) + 3;
      for (let i = 0; i < extra; i++) {
        res.push(0);
      }
    } else if (node.name === 18) {
      let extra = fstream.getUintOf(7) + 11;
      for (let i = 0; i < extra; i++) {
        res.push(0);
      }
    }
  }
  return res;
};

const litLengthExtraBits = [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5,
  5, 5, 0,
];
const litLengthExtraStart = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67,
  83, 99, 115, 131, 163, 195, 227, 258,
];
const decodeLitLength = (litLengthTree) => {
  let node = litLengthTree;
  let codeBits = 0;
  while (!node.leaf) {
    if (fstream.getBit()) {
      node = node.children[1];
    } else {
      node = node.children[0];
    }
    codeBits++
  }
  let lettel = node.name;
  let res = { lit: 0, len: 0, eob: false, codeBits };
  if (lettel < 256) {
    res.lit = lettel;
    res.len = 1;
  } else if (lettel === 256) {
    res.eob = true;
  } else if (lettel > 256 && lettel <= 285) {
    res.len =
      litLengthExtraStart[lettel - 257] +
      fstream.getUintOf(litLengthExtraBits[lettel - 257]);
    res.codeBits += litLengthExtraBits[lettel - 257] 
  }
  return res;
};

const distExtraBits = [
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11,
  11, 12, 12, 13, 13, 0, 0,
];
const distExtraStart = [
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769,
  1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0,
];
const decodeDist = (distTree) => {
    let node = distTree
    let codeBits = 0
    while(!node.leaf){
        if(fstream.getBit()){
            node = node.children[1]
        } else {
            node = node.children[0]
        }
        codeBits++
    }
    let letter = node.name
    return {
        dist:distExtraStart[letter] + fstream.getUintOf(distExtraBits[letter]),
        codeBits: codeBits + distExtraBits[letter] 
    }
}

const decodeBlock = (res) => {
  res.compressedLength = 0
  res.uncompressedLength = 0
  res.matchLength = 0
  res.literalLength = 0
  res.lengthDistribute = new Array(259)
  res.lengthDistribute.fill(0, 0)
  res.distDistribute = new Array(32769)
  res.distDistribute.fill(0, 0)
  res.heatMap = {}
  const heatMapUpdate = (length, dist) => {
      let key = `_${length}_${dist}`
      if(res.heatMap[key]){
          res.heatMap[key]++
      } else {
          res.heatMap[key] = 1
      }
  }
  // 开始解码
  while(1) {
    const { lit: lit, len: len, eob: eob, codeBits:lenCodeBits } = decodeLitLength(res.litLengthTree)
    if(eob){
        break
    } else if (len === 1){
        res.compressedLength += lenCodeBits
        res.uncompressedLength += 8
        res.literalLength += 1
    } else if (len >= 3){
        const { dist, codeBits: distCodeBits } = decodeDist(res.distTree)
        res.compressedLength += (lenCodeBits + distCodeBits)
        res.uncompressedLength += (len * 8)
        res.matchLength += len
        res.lengthDistribute[len]++
        res.distDistribute[len]++
        heatMapUpdate(len, dist)
    }
  }
}

const parseNoCompressionBlock = (res) => {
  res.blockType = "No Compression";
  console.log("No Compression");
  fstream.alignToNextByte()
  res.LEN = fstream.getBytes(2)
  res.uncompressedLength = res.LEN * 8
  res.compressedLength = res.LEN
  console.log(res)
  fstream.getBytes(2)
  for(let i = 0;i < res.LEN; i++){
    fstream.getByte()
  }
  return
};

let fixedLitLengthTree = undefined
let fixedDistTree = undefined
let fixedLitLengthCodeLength = []
let fixedDistCodeLength = []
const parseFixedHuffmanBlock = (res) => {
  res.blockType = "Fixed Huffman Block";
  console.log("Fixed Huffman");
  if(!fixedLitLengthTree){
    // 构造 fixedLitLengthTree
    for(let i = 0; i <= 287; i++){
      if(i <= 143){
        fixedLitLengthCodeLength.push(8)
      } else if (i <= 255){
        fixedLitLengthCodeLength.push(9)
      } else if (i <= 279){
        fixedLitLengthCodeLength.push(7)
      } else {
        fixedLitLengthCodeLength.push(8)
      }
    }
    fixedLitLengthTree = buildHuffmanTree(fixedLitLengthCodeLength)
  }
  if(!fixedDistTree){
    for(let i = 0; i <= 31; i++){
      fixedDistCodeLength.push(5)
    }
    fixedDistTree = buildHuffmanTree(fixedDistCodeLength)
  }

  res.litLengthCodeLength = fixedLitLengthCodeLength
  res.litLengthTree = fixedLitLengthTree
  res.distCodeLength = fixedDistCodeLength
  res.distTree = fixedDistTree

  decodeBlock(res)
};

const parseDynamicHuffmanBlock = (res) => {
  res.blockType = "Dynamic Huffman Block";
  console.log("Dynamic Huffman");
  res.HLIT = fstream.getUintOf(5) + 257;
  res.HDIST = fstream.getUintOf(5) + 1;
  res.HCLEN = fstream.getUintOf(4) + 4;
  // 解码 codeLength 构造 code length tree
  let hclenOrderMap = [
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
  ];
  let hclenOrdered = new Array(hclenOrderMap.length);
  hclenOrdered.fill(0, 0);
  for (let i = 0; i < res.HCLEN; i++) {
    hclenOrdered[hclenOrderMap[i]] = fstream.getUintOf(3);
  }

  res.codeLengthTree = buildHuffmanTree(hclenOrdered);
  
  // 构造 litLengthTree
  res.litLengthCodeLength = decodeCodeLength(res.codeLengthTree, res.HLIT);
  res.litLengthTree = buildHuffmanTree(res.litLengthCodeLength);
  // 构造 distTree
  res.distCodeLength = decodeCodeLength(res.codeLengthTree, res.HDIST);
  res.distTree = buildHuffmanTree(res.distCodeLength);

  decodeBlock(res)
};

const parseBlock = () => {
  let res = {};
  res.BFINAL = fstream.getBit();
  // for debug
  
  res.BTYPE = fstream.getUintOf(2);
  if (res.BTYPE === 0) {
    parseNoCompressionBlock(res);
  } else if (res.BTYPE === 1) {
    parseFixedHuffmanBlock(res);
  } else if (res.BTYPE === 2) {
    parseDynamicHuffmanBlock(res);
  }
  return res;
};

export default parseBlock;
