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
  Alert,
  Spin,
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

const readFile = (f, setProgress) =>
  new Promise((resolve, reject) => {
    let fileReader = new FileReader();

    fileReader.onload = (evt) => {
      resolve(evt.target.result);
    };
    fileReader.onprogress = (evt) => {
      setProgress((evt.loaded / evt.total) * 100);
    };
    fileReader.readAsArrayBuffer(f);
  });

let worker = undefined;

const App = () => {
  // const { result, error } = useWorker(createWorker, { a: 1 });

  const [progress, setProgress] = useState(0);
  const [inflateResult, setInflateResult] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const startWorkerProcess = async (gzFile) => {
    setViewType("load");
    let fileData = await readFile(gzFile, setProgress);
    // 创建 worker
    setProgress(0.1);
    if (worker) {
      // 重新打开文件要重新创建 worker
      worker.terminate();
      worker = undefined;
    }
    worker = new Worker(new URL("./lib/gzip_analyze.worker", import.meta.url));
    worker.onmessage = (e) => {
      if (e.data.type === "INFLATE_RESULT") {
        let inflateResult = e.data.payload;
        inflateResult = inflateResult.map((ir) => {
          ir.blockMenu = [];
          for (let i = 0; i < ir.blocks.length / 100 + 1; i++) {
            let flag = false;
            ir.blockMenu.push([]);
            for (let j = 0; j < 100; j++) {
              let idx = i * 100 + j;
              ir.blockMenu[i].push(idx);
              if (idx >= ir.blocks.length - 1) {
                flag = true;
                break;
              }
            }
            if (flag) break;
          }
          return ir
        });
        setInflateResult(inflateResult);
        setProgress(0);
        setHasMore(true);
        setViewType("none");
      } else if (e.data.type === "INFLATE_PROGRESS") {
        setProgress(e.data.payload);
      } else if (e.data.type === "INFLATE_DONE") {
        worker.terminate();
        worker = undefined;
        setHasMore(false);
      }
    };
    worker.postMessage({ type: "OPEN_FILE", payload: fileData }, [fileData]);
  };

  const loadMore = () => {
    setInflateResult([]);
    //setHasMore(false);
    worker.postMessage({ type: "LOAD_MORE" });
  };

  const uploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      console.log(file.type, file.type.toLowerCase().indexOf("gzip"));
      if (file.type.toLowerCase().indexOf("gzip") === -1) {
        message.error(`${file.name} is not a gzip file`);
      }
      return file.type.toLowerCase().indexOf("gzip") !== -1
        ? false
        : Upload.LIST_IGNORE;
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
    console.log(type);
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
    } else if (type === "load") {
      loadMore();
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
        <div className="version">
          v1.1.0
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
              <div style={{ width: 250 }}>
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
        <Spin spinning={viewType === "load"}>
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
                  title={`Member ${memberIdx} ${member.error ? "⛔️" : ""}`}
                >
                  <Menu.Item
                    key={`header_${memberIdx}`}
                    icon={<AuditOutlined />}
                  >
                    Header {member.header.error ? "⛔️" : ""}
                  </Menu.Item>

                  {member.blockMenu.map((subMenu, subMenuIdx) => (
                    <SubMenu
                      key={`member${subMenuIdx}_blocks`}
                      icon={<HddOutlined />}
                      title={
                        <>
                          Blocks ({subMenuIdx * 100}..
                          {subMenuIdx * 100 + subMenu.length - 1})
                        </>
                      }
                    >
                      {subMenu.map((blockIdx) => {
                        return (
                          <Menu.Item
                            key={`block_${memberIdx}_${blockIdx}`}
                            icon={<BlockOutlined />}
                          >
                            [{blockIdx}] {member.blocks[blockIdx].blockType}{" "}
                            {member.blocks[blockIdx].error ? "⛔️" : ""}
                          </Menu.Item>
                        );
                      })}
                    </SubMenu>
                  ))}

                  {member.trailer ? (
                    <Menu.Item
                      key={`trailer_${memberIdx}`}
                      icon={<BarcodeOutlined />}
                    >
                      Trailer {member.trailer.error ? "⛔️" : ""}
                    </Menu.Item>
                  ) : (
                    <></>
                  )}
                </SubMenu>
              );
            })}
            {hasMore ? (
              <Menu.Item
                key={`load`}
                // icon={<BarcodeOutlined />}
              >
                Load More ...
              </Menu.Item>
            ) : (
              <></>
            )}
          </Menu>
        </Spin>
      </Sider>

      <Layout style={{ marginLeft: 350 }} className="site-layout-background">
        <Content style={{ margin: "24px 28px 0", overflow: "initial" }}>
          {(() => {
            if (viewType === "none") {
              return (
                <>
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
              );
            } else if (viewType === "header") {
              return <HeaderView data={inflateResult[viewMemberIdx].header} />;
            } else if (viewType === "block") {
              return (
                <BlockView
                  memberIdx={viewMemberIdx}
                  blockIdx={viewBlockIdx}
                  data={inflateResult[viewMemberIdx].blocks[viewBlockIdx]}
                />
              );
            } else if (viewType === "trailer") {
              return (
                <TrailerView
                  data={inflateResult[viewMemberIdx].trailer}
                  overview={inflateResult[viewMemberIdx].overview}
                />
              );
            } else if (viewType === "load") {
              return (
                <>
                  <Typography>
                    <Title>Loading, Please Wait...</Title>
                  </Typography>
                </>
              );
            }
          })()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
