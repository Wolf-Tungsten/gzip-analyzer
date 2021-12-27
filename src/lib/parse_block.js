import fstream from "./fstream";
import buildHuffmanTree from "./huffman";
const parseNoCompressionBlock = (res) => {
  res.blockType = "No Compression";
  console.log("No Compression");
};

const parseFixedHuffmanBlock = (res) => {
  res.blockType = "Fixed Huffman Block";
  console.log("Fixed Huffman");
};

const decodeCodeLength = (tree, num) => {
  let res = [];
  while (res.length < num) {
    let node = tree;
    while (!node.leaf) {
      if (fstream.getBit()) {
        node = node["1"];
      } else {
        node = node["0"];
      }
    }
    if (node.alphabet <= 15) {
        res.push(node.alphabet)
    } else if (node.alphabet === 16){
        let extra = fstream.getUintOf(2) + 3
        for(let i = 0; i < extra; i++){
            res.push(res[res.length - 1])
        }
    } else if (node.alphabet === 17){
        let extra = fstream.getUintOf(3) + 3
        for(let i = 0; i < extra; i++){
            res.push(0)
        }
    } else if (node.alphabet === 18){
        let extra = fstream.getUintOf(7) + 11
        for(let i = 0; i < extra; i++){
            res.push(0)
        } 
    }
  }
  return res
};

const parseDynamicHuffmanBlock = (res) => {
  res.blockType = "Dynamic Huffman Block";
  console.log("Dynamic Huffman");
  res.HLIT = fstream.getUintOf(5) + 257;
  res.HDIST = fstream.getUintOf(5) + 1;
  res.HCLEN = fstream.getUintOf(4) + 4;
  let hclenOrderMap = [
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
  ];
  let hclenOrdered = new Array(res.HCLEN);
  hclenOrdered.fill(0, 0);
  for (let i = 0; i < res.HCLEN; i++) {
    hclenOrdered[hclenOrderMap[i]] = fstream.getUintOf(3);
  }
  console.log(res);
  const codeLengthTree = buildHuffmanTree(hclenOrdered);
  const litLengthCodeLength = decodeCodeLength(codeLengthTree, res.HLIT);
  console.log(litLengthCodeLength)
  const distCodeLength = decodeCodeLength(codeLengthTree, res.HDIST);
  console.log(distCodeLength)
  const litLengthTree = buildHuffmanTree(litLengthCodeLength)
  console.log(litLengthTree)
  const distTree = buildHuffmanTree(distCodeLength)
  console.log(distTree)

};

const parseBlock = () => {
  let res = {};
  res.BFINAL = fstream.getBit();
  // for debug
  res.BFINAL = 1;

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
