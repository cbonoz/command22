import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Avatar, Button, Dropdown, Input, Layout, Menu, Select, Spin } from "antd";
import {
  CheckCircleTwoTone,
  GoogleOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";

import { APP_DESC, APP_NAME, CONTEST_LINK } from "./util/constants";
import logo from "./assets/logo_white_os.png";

import VideoStreams from "./components/VideoStreams";
import SensorData from "./components/SensorData";
import { useLogin } from "./firebase/useLogin";

import "./styles.css";
import "antd/dist/antd.css";
import 'leaflet/dist/leaflet.css';
import Modal from "antd/lib/modal/Modal";

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

// const DEFAULT_PAGE = '/lidar'

export default function App() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { user, login, init, isPending, logout } = useLogin();

  if (!init) {
    return (
      <div className="container">
        <Spin size="large" />
      </div>
    );
  }

  const height = window.innerHeight - 135;

  if (!user) {
    return (
      <div className="App container standard-padding centered">
        <br /><br /><br />
        <img src={logo} className="standard-padding login-logo" />
        <p className="white">{APP_DESC}.</p>
        <br />
        <Button
          size="large"
          className="standard-button"
          onClick={login}
          type="primary"
          loading={isPending}
          disabled={isPending}
        >
          <GoogleOutlined />
          &nbsp;Login with Google
        </Button>
        <br />
        <br />
        <div className="white footer">
          <br />
          ---
          <br />
          <p>{APP_NAME} &copy;2022<br />
            Built for the <a href={CONTEST_LINK} target="_blank">CommanDING Tech Challenge 2022</a></p>
        </div>
      </div>
    );
  }

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="#" rel="noopener noreferrer" onClick={(e) => {
              e.preventDefault();
              setShowSettings(true);
            }}>
              Settings
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="#" rel="noopener noreferrer" onClick={(e) => {
              e.preventDefault();
              logout()
            }}>
              Logout
            </a>
          ),
        },
      ]}
    />
  )

  const menuItems = [
    {
      key: '/',
      label: <>    <img
        src={logo}
        className="header-logo pointer"
        onClick={() => navigate("/")} />
      </>,
      onClick: () => navigate("/"),
    }
    // ,
    // {
    //   key: '/videos',
    //   label: <><VideoCameraFilled /> Video Streams</>,
    //   onClick: () => navigate("/videos"),
    // }
    ,
    {
      label: <span style={{ marginLeft: 'auto' }}>
        <span>
          <CheckCircleTwoTone twoToneColor="#52c41a" />&nbsp;
          <span className="green">Connected</span>
          &nbsp;
          &nbsp;
        </span>
        {user && <Dropdown overlay={userMenu} className="pointer">
          <span className="pointer">
            <Avatar size="large" src={user.photoURL} />
            &nbsp;{user.displayName}&nbsp;
          </span>
        </Dropdown>}
        &nbsp;
      </span>
    }]

  return (
    <div className="App">
      <Layout>
        <Header>
          <Menu mode="horizontal"
            selectedKeys={[window.location.pathname]}
            items={menuItems}
          >
          </Menu>
        </Header>
        <Layout>
          <Content>
            <div style={{ height }}>
              <Routes>
                <Route path="/" element={<SensorData user={user} />} />
                {/* <Route path="/lidar" element={<Map user={user} />} /> */}
                <Route path="/videos" element={<VideoStreams user={user} />} />
                <Route path="/videos/:cameraId" element={<VideoStreams user={user} />} />
                <Route path="/sensorData" element={<SensorData user={user} />} />

              </Routes>
            </div>
          </Content>
        </Layout>
        <Footer>

        </Footer>
        <Modal
          onCancel={() => setShowSettings(false)}
          onOk={() => setShowSettings(false)}
          title="Settings"
          open={showSettings}
          size="md"
        >
          {/* <h1>Settings</h1> */}
          {/* <p>Coming soon...</p> */}
          <p>This app is currently using preview mode settings.</p>
        </Modal>
      </Layout>


    </div>
  );
}
