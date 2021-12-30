!function(){"use strict";var e={6598:function(e,t,n){var r=n(1744),i=n.n(r),a={data:new Uint8Array(0),headAddr:0,headByte:0,headByteRemainBits:0,init:function(e){this.data=new Uint8Array(e),this.reset()},reset:function(){this.headAddr=0,this.headByte=this.data[0],this.headByteRemainBits=8},eof:function(){return 0===this.headByteRemainBits?this.headAddr+1>=this.data.length:this.headAddr>=this.data.length},bitsMask:[0,1,3,7,15,31,63,127,255],getBigIntOf:function(e){var t=i()(0);if(e<=this.headByteRemainBits)return t=i()(this.headByte&this.bitsMask[e]),this.headByteRemainBits-=e,this.headByte=this.headByte>>e,t;var n=e;for(this.headByteRemainBits>0&&(e-=this.headByteRemainBits,t=i()(this.headByte),this.headByteRemainBits=0,this.headByte=0);e>=8;){if(this.headAddr+=1,this.headAddr>=this.data.length)return i()(-1);t=t.add(i()(this.data[this.headAddr]).shiftLeft(n-e)),e-=8}if(e>0){if(this.headAddr+=1,this.headAddr>=this.data.length)return i()(-1);this.headByte=this.data[this.headAddr],t=t.add(i()(this.headByte&this.bitsMask[e]).shiftLeft(n-e)),this.headByteRemainBits=8-e,this.headByte=this.headByte>>e}return t},getUintOf:function(e){return this.getBigIntOf(e).toJSNumber()},getBit:function(){return this.getBigIntOf(1).toJSNumber()},getByte:function(){return this.getBigIntOf(8).toJSNumber()},getBytes:function(e){return this.getBigIntOf(8*e).toJSNumber()},getBytesArray:function(e){for(var t=[],n=0;n<e;n++)t.push(this.getByte());return t},alignToNextByte:function(){this.headByteRemainBits>0&&(this.headAddr++,this.headAddr>=this.data.length?this.headByteRemainBits=0:(this.headByteRemainBits=8,this.headByte=this.data[this.headAddr]))}},o=n(8451),h=n.n(o),s=function e(t,n,r){if(1===n.length)return t.leaf=!0,t.value=1,void(t.name=n[0].alphabet);t.leaf=!1,t.name=r;var i=n.filter((function(e){return e.code.startsWith("0")})).map((function(e){return{alphabet:e.alphabet,code:e.code.slice(1)}})),a=n.filter((function(e){return e.code.startsWith("1")})).map((function(e){return{alphabet:e.alphabet,code:e.code.slice(1)}}));t.children=[{},{}],i.length>0&&(t.leaf=!1,e(t.children[0],i,0)),a.length>0&&(t.leaf=!1,e(t.children[1],a,1))},d=function(e){var t=new Array(16);t.fill(0,0),e.forEach((function(e){t[e]++}));var n=new Array(16);n.fill(0,0);for(var r=2;r<n.length;r++)n[r]=2*(n[r-1]+t[r-1]);var i=e.map((function(e,t){for(var r=0===e?"":(n[e]++).toString(2);r.length<e;)r="0"+r;return{alphabet:t,code:r}})).filter((function(e){return""!==e.code})),a={};return s(a,i,"root"),[a,i]},u=function(e,t){for(var n=[];n.length<t;){for(var r=e;!r.leaf;)r=a.getBit()?r.children[1]:r.children[0];if(r.name<=15)n.push(r.name);else if(16===r.name)for(var i=a.getUintOf(2)+3,o=0;o<i;o++)n.push(n[n.length-1]);else if(17===r.name)for(var h=a.getUintOf(3)+3,s=0;s<h;s++)n.push(0);else if(18===r.name)for(var d=a.getUintOf(7)+11,u=0;u<d;u++)n.push(0)}return n},f=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],c=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],g=function(e){for(var t=e,n=0;!t.leaf;)t=a.getBit()?t.children[1]:t.children[0],n++;var r=t.name,i={lit:0,len:0,eob:!1,codeBits:n};return r<256?(i.lit=r,i.len=1):256===r?i.eob=!0:r>256&&r<=285&&(i.len=c[r-257]+a.getUintOf(f[r-257]),i.codeBits+=f[r-257]),i},l=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],B=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],p=function(e){for(var t=e,n=0;!t.leaf;)t=a.getBit()?t.children[1]:t.children[0],n++;var r=t.name;return{dist:B[r]+a.getUintOf(l[r]),codeBits:n+l[r]}},y=function(e){e.compressedLength=0,e.uncompressedLength=0,e.matchLength=0,e.literalLength=0,e.averageDist=0,e.averageLength=0,e.lengthDistribute=new Array(259),e.lengthDistribute.fill(0,0),e.distDistribute=new Array(32769),e.distDistribute.fill(0,0),e.heatMap={};for(var t=function(t,n){var r="_".concat(t,"_").concat(n);e.heatMap[r]?e.heatMap[r]++:e.heatMap[r]=1};;){var n=g(e.litLengthTree),r=(n.lit,n.len),i=n.eob,a=n.codeBits;if(i)break;if(1===r)e.compressedLength+=a,e.uncompressedLength+=8,e.literalLength+=1;else if(r>=3){var o=p(e.distTree),h=o.dist,s=o.codeBits;e.compressedLength+=a+s,e.uncompressedLength+=8*r,e.matchLength+=r,e.lengthDistribute[r]++,e.distDistribute[h]++,t(r,h)}}e.averageDist=e.distDistribute.map((function(e,t){return e*t})).reduce((function(e,t){return e+t}))/e.distDistribute.reduce((function(e,t){return e+t})),e.averageLength=e.lengthDistribute.map((function(e,t){return e*t})).reduce((function(e,t){return e+t}))/e.lengthDistribute.reduce((function(e,t){return e+t}))},m=void 0,v=void 0,L=void 0,b=void 0,O=[],T=[],E=function(e){e.BFINAL=a.getBit(),e.BTYPE=a.getUintOf(2),0===e.BTYPE?function(e){e.blockType="No Compression Block",a.alignToNextByte(),e.LEN=a.getBytes(2),e.uncompressedLength=8*e.LEN,e.compressedLength=8*e.LEN,a.getBytes(2);for(var t=0;t<e.LEN;t++)a.getByte()}(e):1===e.BTYPE?function(e){if(e.blockType="Fixed Huffman Block",!L){for(var t=0;t<=287;t++)t<=143?O.push(8):t<=255?O.push(9):t<=279?O.push(7):O.push(8);var n=d(O);L=n[0],m=n[1]}if(!b){for(var r=0;r<=31;r++)T.push(5);var i=d(T);b=i[0],v=i[1]}e.litLengthHuffmanCode=m,e.litLengthCodeLength=O,e.litLengthTree=L,e.distHuffmanCode=v,e.distCodeLength=T,e.distTree=b,y(e)}(e):2===e.BTYPE&&function(e){e.blockType="Dynamic Huffman Block",e.HLIT=a.getUintOf(5)+257,e.HDIST=a.getUintOf(5)+1,e.HCLEN=a.getUintOf(4)+4;var t=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],n=new Array(t.length);n.fill(0,0);for(var r=0;r<e.HCLEN;r++)n[t[r]]=a.getUintOf(3);var i=d(n);e.codeLengthTree=i[0],e.codeLengthHuffmanCode=i[1],e.litLengthCodeLength=u(e.codeLengthTree,e.HLIT),i=d(e.litLengthCodeLength),e.litLengthTree=i[0],e.litLengthHuffmanCode=i[1],e.distCodeLength=u(e.codeLengthTree,e.HDIST),i=d(e.distCodeLength),e.distTree=i[0],e.distHuffmanCode=i[1],y(e)}(e),postMessage({type:"INFLATE_PROGRESS",payload:a.headAddr/a.data.length*100})},A=function(){var e={};try{e.ID1=a.getByte(),e.ID2=a.getByte(),e.CM=a.getByte(),e.FLG={},e.FLG.FTEXT=a.getBit(),e.FLG.FHCRC=a.getBit(),e.FLG.FEXTRA=a.getBit(),e.FLG.FNAME=a.getBit(),e.FLG.FCOMMENT=a.getBit(),e.FLG.reserved0=a.getBit(),e.FLG.reserved1=a.getBit(),e.FLG.reserved2=a.getBit();var t=a.getBytes(4);e.MTIME=h()(1e3*t).format("YYYY-MM-DD HH:mm:ss"),e.XFL=a.getByte();var n=["FAT filesystem (MS-DOS, OS/2, NT/Win32)","Amiga","VMS (or OpenVMS)","Unix","VM/CMS","Atari TOS","HPFS filesystem (OS/2, NT)","Macintosh","Z-System","CP/M","TOPS-20","NTFS filesystem (NT)","QDOS","Acorn RISCOS"];if(e.OS=a.getByte(),e.OS>=n.length?e.OS="unknown":e.OS=n[e.OS],1===e.FLG.FEXTRA&&(e.XLEN=a.getBytes(2),e.EXTRAFIELD=a.getBytesArray(e.XLEN)),1===e.FLG.FNAME)for(e.FILENAME="";;){var r=a.getByte();if(0===r)break;e.FILENAME=e.FILENAME.concat(String.fromCharCode(r))}if(1===e.FLG.FCOMMENT)for(e.COMMENT="";;){var i=a.getByte();if(0===i)break;e.COMMENT=e.COMMENT.concat(String.fromCharCode(i))}1===e.FLG.FHCRC&&(e.HEADER_CRC16=a.getBytes(2))}catch(o){e.error=!0}return e},C=function(){for(var e=[];;){var t={};try{E(t)}catch(n){t.error=!0}if(e.push(t),t.BFINAL||t.error)break}return e},F=function(){var e={error:!1,header:A(),blocks:C(),trailer:(a.alignToNextByte(),{CRC32:a.getBytes(4),ISIZE:a.getBytes(4)})};e.error=!!e.header.error||0===e.blocks.length||e.blocks[e.blocks.length-1].error,e.header.uncompressedLength=e.blocks.map((function(e){return e.uncompressedLength})).reduce((function(e,t){return e+t})),e.header.compressedLength=e.blocks.map((function(e){return e.compressedLength})).reduce((function(e,t){return e+t}));var t=e.blocks.filter((function(e){return!e.error&&0!==e.BTYPE}));return e.header.matchLength=t.map((function(e){return e.matchLength})).reduce((function(e,t){return e+t})),e.header.literalLength=t.map((function(e){return e.literalLength})).reduce((function(e,t){return e+t})),e.header.averageDist=t.map((function(e){return e.averageDist})).reduce((function(e,t){return e+t}))/t.length,e.header.averageLength=t.map((function(e){return e.averageLength})).reduce((function(e,t){return e+t}))/t.length,e},M=function(e){a.init(e);for(var t=[];!a.eof();){var n=F();if(t.push(n),n.error)break}return t};onmessage=function(e){"OPEN_FILE"===e.data.type&&postMessage({type:"INFLATE_RESULT",payload:M(e.data.payload)})}}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var a=t[r]={id:r,loaded:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}n.m=e,n.x=function(){var e=n.O(void 0,[923],(function(){return n(6598)}));return e=n.O(e)},function(){var e=[];n.O=function(t,r,i,a){if(!r){var o=1/0;for(u=0;u<e.length;u++){r=e[u][0],i=e[u][1],a=e[u][2];for(var h=!0,s=0;s<r.length;s++)(!1&a||o>=a)&&Object.keys(n.O).every((function(e){return n.O[e](r[s])}))?r.splice(s--,1):(h=!1,a<o&&(o=a));if(h){e.splice(u--,1);var d=i();void 0!==d&&(t=d)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[r,i,a]}}(),n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,r){return n.f[r](e,t),t}),[]))},n.u=function(e){return"static/js/"+e+".453f35c0.chunk.js"},n.miniCssF=function(e){},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e},n.p="/gzip-analyzer/",function(){var e={598:1};n.f.i=function(t,r){e[t]||importScripts(n.p+n.u(t))};var t=self.webpackChunkgzip_analyzer=self.webpackChunkgzip_analyzer||[],r=t.push.bind(t);t.push=function(t){var i=t[0],a=t[1],o=t[2];for(var h in a)n.o(a,h)&&(n.m[h]=a[h]);for(o&&o(n);i.length;)e[i.pop()]=1;r(t)}}(),function(){var e=n.x;n.x=function(){return n.e(923).then(e)}}();n.x()}();
//# sourceMappingURL=598.e38d81dc.chunk.js.map