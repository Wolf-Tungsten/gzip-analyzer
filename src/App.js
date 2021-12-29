import React, { useState } from "react";
import {
  Button,
  Layout,
  Menu,
  Row,
  Space,
  Divider,
  Typography,
  Upload,
  message,
  Progress,
  Badge
} from "antd";
import "./App.css";
import {
  FolderOutlined,
  BlockOutlined,
  AuditOutlined,
  BarcodeOutlined,
  HddOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useWorker } from "react-hooks-worker";

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const readFile = (f) =>
  new Promise((resolve, reject) => {
    let fileReader = new FileReader();

    fileReader.onload = (evt) => {
      resolve(evt.target.result);
    };

    fileReader.readAsArrayBuffer(f);
  });

const App = () => {
  // const { result, error } = useWorker(createWorker, { a: 1 });

  const [progress, setProgress] = useState(0);
  const [inflateResult, setInflateResult] = useState([]);
  const startWorkerProcess = async (gzFile) => {
    let fileData = await readFile(gzFile);
    console.log(fileData);
    // 创建 worker
    setProgress(0.1);
    let worker = new Worker(
      new URL("./lib/gzip_analyze.worker", import.meta.url)
    );
    worker.onmessage = (e) => {
      //console.log('message from worker')
      if (e.data.type === "INFLATE_RESULT") {
        worker.terminate();
        console.log(e.data);
        setInflateResult(e.data.payload);
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
        }, 1000);
      } else if (e.data.type === "INFLATE_PROGRESS") {
        setProgress(e.data.payload);
      }
    };
    worker.postMessage({ type: "OPEN_FILE", payload: fileData }, [fileData]);
  };

  const uploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      console.log(file.type);
      if (file.type !== "application/x-gzip") {
        message.error(`${file.name} is not a gzip file`);
      }
      return file.type === "application/x-gzip" ? false : Upload.LIST_IGNORE;
      //return Upload.LIST_IGNORE
    },
    onChange: (info) => {
      //console.log(info.fileList);
      startWorkerProcess(info.file);
    },
  };

  const onMenuItemClick = ({key}) => {
    let [type, memberIdx, blockIdx] = key.split('_')
    memberIdx = parseInt(memberIdx)
    if(type === 'header'){
      console.log(inflateResult[memberIdx].header)
    } else if (type === 'block'){
      blockIdx = parseInt(blockIdx)
      console.log(inflateResult[memberIdx].blocks[blockIdx])
    } else if (type === 'trailer'){
      console.log(inflateResult[memberIdx].trailer)
    }
  }

  return (
    <Layout>
      <Sider
        width="330"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <div className="title">
          <span style={{ fontSize: 32 }}>🗜</span> Gzip Analyzer
        </div>
        <Divider
          dashed={true}
          style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
        ></Divider>
        {progress === 0 ? (
          <Row justify="center">
            <Space value="30">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Open *.gz file</Button>
              </Upload>
            </Space>
          </Row>
        ) : (
          <Row justify="center">
            <Space value="30">
              <div style={{ width: 150 }}>
                <Progress
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  percent={progress}
                  showInfo={false}
                />
              </div>
            </Space>
          </Row>
        )}
        <Divider
          dashed={true}
          style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
        ></Divider>
        <Menu theme="dark" mode="inline" defaultOpenKeys={["member0"]} onClick={onMenuItemClick}>
          {inflateResult.map((member, memberIdx) => {
            return (
              <SubMenu
                key={`member${memberIdx}`}
                icon={<FolderOutlined />}
                title={`Member ${memberIdx}`}
              >
                <Menu.Item
                  key={`header_${memberIdx}`}
                  icon={<AuditOutlined />}
                >
                  Header
                </Menu.Item>
                <SubMenu
                  key={`member${memberIdx}_blocks`}
                  icon={<HddOutlined />}
                  title={<>Blocks ({member.blocks.length})</>}
                >
                  {
                    member.blocks.map((block, blockIdx) => {
                      return (<Menu.Item key={`block_${memberIdx}_${blockIdx}`} icon={<BlockOutlined />}>
                        [{blockIdx}] {block.blockType}
                      </Menu.Item>)
                    })
                  }
                </SubMenu>
                <Menu.Item
                  key={`trailer_${memberIdx}`}
                  icon={<BarcodeOutlined />}
                >
                  Trailer
                </Menu.Item>
              </SubMenu>
            );
          })}
        </Menu>
      </Sider>
    </Layout>
  );
};

export default App;
