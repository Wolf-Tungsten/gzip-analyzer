import fstream from "./fstream"

const MAX_BITS = 15

const _buildHuffmanTree = (tree, nodes, name) => {
    if(nodes.length === 1){
        tree.leaf = true
        tree.value = 1
        tree.name = nodes[0].alphabet
        return
    } 
    tree.leaf = false
    tree.name = name
    let lNodes = nodes.filter( node => node.code.startsWith('0') ).map( node => ({
        alphabet: node.alphabet,
        code: node.code.slice(1)
    }))
    let rNodes = nodes.filter( node => node.code.startsWith('1') ).map( node => ({
        alphabet: node.alphabet,
        code: node.code.slice(1)
    })) 
    tree.children = [{}, {}]
    if(lNodes.length > 0){
        tree.leaf = false
        _buildHuffmanTree(tree.children[0], lNodes, 0)
    }
    if(rNodes.length > 0){
        tree.leaf = false
        _buildHuffmanTree(tree.children[1], rNodes, 1)
    }
}
const buildHuffmanTree = (codeLengths) => {
    let blCount = new Array( MAX_BITS + 1 )
    blCount.fill(0, 0)
    codeLengths.forEach(elem => {
        blCount[elem]++;
    });
    //console.log(blCount)
    let nextCode = new Array( MAX_BITS + 1 )
    nextCode.fill(0, 0)
    for(let i = 2; i < nextCode.length; i++){
        nextCode[i] = (nextCode[i - 1] + blCount[i - 1]) * 2;
    }
    //console.log(nextCode)
    let huffmanNodes = codeLengths.map((elem, idx) => {
        let c = elem === 0 ? "" : (nextCode[elem]++).toString(2)
        while(c.length < elem){
            c = "0" + c
        }
        return { alphabet: idx, code: c }
    }).filter( elem => elem.code !== '')
    //console.log(huffmanNodes)
    let tree = {}
    let sankey = {data:[], links:[]}
    _buildHuffmanTree(tree, huffmanNodes, "root")
    //console.log(tree)
    return tree
}

export default buildHuffmanTree