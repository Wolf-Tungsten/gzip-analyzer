import React from "react";
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

const readFile = ( f ) => (new Promise((resolve, reject)=>{

  let fileReader = new FileReader()

  fileReader.onload = (evt) => {
    resolve(evt.target.result)
  }

  fileReader.readAsArrayBuffer(f)
  
}));

const App = () => {
  // const { result, error } = useWorker(createWorker, { a: 1 });

  const startWorkerProcess = async (gzFile) => {
    let fileData = await readFile(gzFile)
    console.log(fileData)
    // 创建 worker
    let worker = new Worker(new URL("./lib/gzip_analyze.worker", import.meta.url));
    worker.onmessage = (e) => {
       //console.log('message from worker')
       console.log(e)
       worker.terminate()
    }
    worker.postMessage({type:'OPEN_FILE', payload:fileData}, [fileData])
  }

  const uploadProps = {
    showUploadList:false,
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

  

  return (
    <Layout>
      <Sider
        width="240"
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
        <Row justify="center">
          <Space value="30">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Open *.gz file</Button>
            </Upload>
          </Space>
        </Row>
        <Divider
          dashed={true}
          style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
        ></Divider>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
          <SubMenu key="member0" icon={<FolderOutlined />} title="Member 0">
            <Menu.Item key="member0_header" icon={<AuditOutlined />}>
              Header
            </Menu.Item>
            <SubMenu key="member0_blocks" icon={<HddOutlined />} title="Blocks">
              <Menu.Item key="0" icon={<BlockOutlined />}>
                Block 0
              </Menu.Item>
              <Menu.Item key="1" icon={<BlockOutlined />}>
                Block 1
              </Menu.Item>
              <Menu.Item key="2" icon={<BlockOutlined />}>
                Block 2
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="member0_trailer" icon={<BarcodeOutlined />}>
              Trailer
            </Menu.Item>
          </SubMenu>

          <SubMenu key="member1" icon={<FolderOutlined />} title="Member 1">
            <Menu.Item key="member1_header" icon={<AuditOutlined />}>
              Header
            </Menu.Item>
            <SubMenu key="member1_blocks" icon={<HddOutlined />} title="Blocks">
              <Menu.Item key="3" icon={<BlockOutlined />}>
                Block 0
              </Menu.Item>
              <Menu.Item key="4" icon={<BlockOutlined />}>
                Block 1
              </Menu.Item>
              <Menu.Item key="5" icon={<BlockOutlined />}>
                Block 2
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="member1_trailer" icon={<BarcodeOutlined />}>
              Trailer
            </Menu.Item>
          </SubMenu>

          <SubMenu key="member2" icon={<FolderOutlined />} title="Member 2">
            <Menu.Item key="member2_header" icon={<AuditOutlined />}>
              Header
            </Menu.Item>
            <SubMenu key="member2_blocks" icon={<HddOutlined />} title="Blocks">
              <Menu.Item key="6" icon={<BlockOutlined />}>
                Block 0
              </Menu.Item>
              <Menu.Item key="7" icon={<BlockOutlined />}>
                Block 1
              </Menu.Item>
              <Menu.Item key="8" icon={<BlockOutlined />}>
                Block 2
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="member2_trailer" icon={<BarcodeOutlined />}>
              Trailer
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default App;
