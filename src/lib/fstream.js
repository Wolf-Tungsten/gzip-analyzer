import bigInt from 'big-integer'
const fstream = {
    data:new Uint8Array(0),
    headAddr:0,
    headByte:0,
    headByteRemainBits:0,
    init:function(data){
        console.log(data)
        this.data = new Uint8Array(data)
        this.reset()
    },
    reset:function(){
        this.headAddr = 0
        this.headByte = this.data[0]
        this.headByteRemainBits = 8
    },
    eof:function(){
        return this.headAddr >= this.data.length
    },
    bitsMask:[0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f, 0xff],
    getBigIntOf:function(bits){
        let bigIntResult = bigInt(0)
        if(bits <= this.headByteRemainBits){
            // 剩余 headByte 部分即可满足
            bigIntResult = bigInt(this.headByte & this.bitsMask[bits])
            this.headByteRemainBits -= bits
            this.headByte = (this.headByte >> bits)
            return bigIntResult
        } else {
            let loadBits = bits
            // 先把 headByte 剩余部分用掉
            if(this.headByteRemainBits > 0){
                bits -= this.headByteRemainBits
                bigIntResult = bigInt(this.headByte)
                this.headByteRemainBits = 0
                this.headByte = 0
            }
             
            // headByte 已用完，开始读取新的字节
            while(bits >= 8){
                this.headAddr += 1
                if(this.headAddr >= this.data.length){
                    // 文件中已经没有剩余字节了,但还没有读完
                    return bigInt(-1) // 读取失败
                }
                bigIntResult = bigIntResult.add(bigInt(this.data[this.headAddr]).shiftLeft(loadBits - bits))
                bits -= 8
            }
            if(bits > 0){
                this.headAddr += 1
                // 剩余位不足一字节的部分
                // 先读取一字节到 headByte 中
                if(this.headAddr >= this.data.length){
                    return bigInt(-1)
                }
                this.headByte = this.data[this.headAddr]
                bigIntResult = bigIntResult.add(bigInt(this.headByte & this.bitsMask[bits]).shiftLeft(loadBits - bits))
                this.headByteRemainBits = 8 - bits
                this.headByte = this.headByte >> bits
            }
        }
        return bigIntResult

    },
    getUintOf:function(bits){
        return this.getBigIntOf(bits).toJSNumber()
    },
    getBit:function(){
        return this.getBigIntOf(1).toJSNumber()
    },
    getByte:function(){
        return this.getBigIntOf(8).toJSNumber()
    },
    getBytes:function(bytes){
        return this.getBigIntOf(bytes * 8).toJSNumber()
    },
    getBytesArray:function(bytes){
        let res = []
        for(let i = 0; i < bytes; i++){
            res.push(this.getByte())
        }
        return res
    },
    alignToNextByte:function(){
        if(this.headByteRemainBits > 0){
            this.headAddr++
            if(this.headAddr >= this.data.length){
                this.headByteRemainBits = 0
            } else {
                this.headByteRemainBits = 8
                this.headByte = this.data[this.headAddr]
            }
        }
    }
}
export default fstream