import React from "react";
import { Button, Layout, Menu, Row, Space, Divider, Typography } from "antd";
import "./App.css";
import {
  FolderOutlined,
  BlockOutlined,
  AuditOutlined,
  BarcodeOutlined,
  HddOutlined,
} from "@ant-design/icons";
import { useWorker } from "react-hooks-worker";

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const createWorker = () =>
  new Worker(new URL("./slow_fib.worker", import.meta.url));

const CalcFib = ({ count }) => {
  const { result, error } = useWorker(createWorker, { i: count }); // now the input is wrapper in an object
  if (error) return <div>Error: {error}</div>;
  return <div>Result: {result}</div>;
};

const App = () => {
  const { result, error } = useWorker(createWorker, { a: 1 });
  return (
    <Layout>
      <CalcFib count={10}/>
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
            <Button type="primary">Open *.gz File</Button>
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
