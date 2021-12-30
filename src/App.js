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
  Badge,
  Alert
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
import { HeaderView } from "./view/HeaderView";
import { BlockView } from "./view/BlockView";
import { TrailerView } from "./view/TrailerView";

const { Title, Paragraph, Text, Link } = Typography;
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

  const [viewType, setViewType] = useState("none");
  const [viewMemberIdx, setViewMemberIdx] = useState(0);
  const [viewBlockIdx, setViewBlockIdx] = useState(0);

  const onMenuItemClick = ({ key }) => {
    let [type, memberIdx, blockIdx] = key.split("_");
    memberIdx = parseInt(memberIdx);
    console.log(type)
    setViewType(type);
    setViewMemberIdx(memberIdx);
    if (type === "header") {
      console.log(inflateResult[memberIdx].header);
    } else if (type === "block") {
      blockIdx = parseInt(blockIdx);
      setViewBlockIdx(blockIdx);
      console.log(inflateResult[memberIdx].blocks[blockIdx]);
    } else if (type === "trailer") {
      console.log(inflateResult[memberIdx].trailer);
    }
  };

  return (
    <Layout>
      <Sider
        width="350"
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
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={["member0"]}
          onClick={onMenuItemClick}
        >
          {inflateResult.map((member, memberIdx) => {
            return (
              <SubMenu
                key={`member${memberIdx}`}
                icon={<FolderOutlined />}
                title={`Member ${memberIdx} ${member.error ? '⛔️' : ''}`}
              >
                <Menu.Item key={`header_${memberIdx}`} icon={<AuditOutlined />}>
                  Header  {member.header.error ? '⛔️' : ''} 
                </Menu.Item>
                <SubMenu
                  key={`member${memberIdx}_blocks`}
                  icon={<HddOutlined />}
                  title={<>Blocks ({member.blocks.length})</>}
                >
                  {member.blocks.map((block, blockIdx) => {
                    return (
                      <Menu.Item
                        key={`block_${memberIdx}_${blockIdx}`}
                        icon={<BlockOutlined />}
                      >
                        [{blockIdx}] {block.blockType} {block.error ? '⛔️' : ''} 
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
                <Menu.Item
                  key={`trailer_${memberIdx}`}
                  icon={<BarcodeOutlined />}
                >
                  Trailer {member.trailer.error ? '⛔️' : ''}
                </Menu.Item>
              </SubMenu>
            );
          })}
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: 350 }} className="site-layout-background">
        <Content style={{ margin: "24px 28px 0", overflow: "initial" }}>
          {(() => {
            if (viewType === "none") {
              return <>
              <Typography>
                <Title>Welcome to Gzip Analyzer!</Title>
                <Paragraph>
                  
                  <Alert
      message="Hint"
      description="Please open a gzip file first. Then select a menu item to view the details."
      type="info"
      showIcon
    />
                </Paragraph>
              </Typography>
              </>
            } else if (viewType === "header") {
              return <HeaderView data={inflateResult[viewMemberIdx].header} />
            } else if (viewType === "block") {
              return <BlockView memberIdx={viewMemberIdx} blockIdx={viewBlockIdx} data={inflateResult[viewMemberIdx].blocks[viewBlockIdx]}/>;
            } else if (viewType === "trailer") {
              return <TrailerView data={inflateResult[viewMemberIdx].trailer} />
            }
          })()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
