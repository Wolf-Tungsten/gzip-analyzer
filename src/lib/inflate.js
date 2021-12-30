import fstream from "./fstream";
import moment from "moment";
import parseBlock from "./parse_block";

const parseHeader = () => {
  const res = {};
  try {
    res.ID1 = fstream.getByte();
    res.ID2 = fstream.getByte();
    res.CM = fstream.getByte();
    res.FLG = {};
    // 解码 FLG
    res.FLG.FTEXT = fstream.getBit();
    res.FLG.FHCRC = fstream.getBit();
    res.FLG.FEXTRA = fstream.getBit();
    res.FLG.FNAME = fstream.getBit();
    res.FLG.FCOMMENT = fstream.getBit();
    res.FLG.reserved0 = fstream.getBit();
    res.FLG.reserved1 = fstream.getBit();
    res.FLG.reserved2 = fstream.getBit();
    // 解码 MTIME
    let MTIME = fstream.getBytes(4);
    res.MTIME = moment(MTIME * 1000).format("YYYY-MM-DD HH:mm:ss");
    // XFL
    res.XFL = fstream.getByte();
    // OS
    let osEnum = [
      "FAT filesystem (MS-DOS, OS/2, NT/Win32)",
      "Amiga",
      "VMS (or OpenVMS)",
      "Unix",
      "VM/CMS",
      "Atari TOS",
      "HPFS filesystem (OS/2, NT)",
      "Macintosh",
      "Z-System",
      "CP/M",
      "TOPS-20",
      "NTFS filesystem (NT)",
      "QDOS",
      "Acorn RISCOS",
    ];
    res.OS = fstream.getByte();
    if (res.OS >= osEnum.length) {
      res.OS = "unknown";
    } else {
      res.OS = osEnum[res.OS];
    }
    if (res.FLG.FEXTRA === 1) {
      res.XLEN = fstream.getBytes(2);
      res.EXTRAFIELD = fstream.getBytesArray(res.XLEN);
    }
    if (res.FLG.FNAME === 1) {
      res.FILENAME = "";
      while (1) {
        let c = fstream.getByte();
        if (c === 0) {
          break;
        }
        res.FILENAME = res.FILENAME.concat(String.fromCharCode(c));
      }
    }
    if (res.FLG.FCOMMENT === 1) {
      res.COMMENT = "";
      while (1) {
        let c = fstream.getByte();
        if (c === 0) {
          break;
        }
        res.COMMENT = res.COMMENT.concat(String.fromCharCode(c));
      }
    }
    if (res.FLG.FHCRC === 1) {
      res.HEADER_CRC16 = fstream.getBytes(2);
    }
    
  } catch {
      res.error = true
  }
  return res;
};

const parseBlocks = () => {
  let res = [];

  while (1) {
      let block = {};
      try {
        parseBlock(block)
      } catch {
        block.error = true
      } 
      res.push(block);
      if (block.BFINAL || block.error) {
        break;
      }
    }

  return res;
};

const parseTrailer = () => {
  fstream.alignToNextByte();
  let res = {
    CRC32: fstream.getBytes(4),
    ISIZE: fstream.getBytes(4),
  };
  return res;
};

const parseMember = () => {
  let res = {
    error:false,
    header: parseHeader(),
    blocks: parseBlocks(),
    trailer: parseTrailer(),
  };
  res.error = (!!res.header.error) || (res.blocks.length === 0 || res.blocks[res.blocks.length - 1].error)
  // 全局统计数据
  res.header.uncompressedLength = res.blocks.map(b => b.uncompressedLength).reduce((a, b) => a + b)
  res.header.compressedLength = res.blocks.map(b => b.compressedLength).reduce((a, b) => a + b)
  let compressedBlocks = res.blocks.filter( b => (!b.error && (b.BTYPE !== 0)))
  res.header.matchLength = compressedBlocks.map(b => b.matchLength).reduce((a, b) => a + b)
  res.header.literalLength = compressedBlocks.map(b => b.literalLength).reduce((a, b) => a + b)
  res.header.averageDist = compressedBlocks.map(b => b.averageDist).reduce((a, b) => a + b) / compressedBlocks.length
  res.header.averageLength = compressedBlocks.map(b => b.averageLength).reduce((a, b) => a + b) / compressedBlocks.length 
  return res;
};

const inflate = function (inputFileData) {
  fstream.init(inputFileData);
  let res = [];
  while (!fstream.eof()) {
    let m = parseMember()
    res.push(m)
    if(m.error){
        break
    }
  }
  return res;
};

export { inflate };
