import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Avatar, Button, Dropdown, Layout, Menu, Select, Spin } from "antd";
import {
  CheckCircleTwoTone,
  GoogleOutlined,
  BuildOutlined,
  ScanOutlined,
  NotificationFilled,
  VideoCameraFilled,
  FundViewOutlined,
} from "@ant-design/icons";

import { APP_DESC, APP_NAME } from "./util/constants";
import logo from "./assets/logo_white.png";

import Home from "./components/Home";
import Map from "./components/Map";
import Notifications from "./components/Notifications";
import VideoStreams from "./components/VideoStreams";
import SensorData from "./components/SensorData";
import { useLogin } from "./firebase/useLogin";

import "./styles.css";
import "antd/dist/antd.css";
import 'leaflet/dist/leaflet.css';

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

// const DEFAULT_PAGE = '/lidar'

export default function App() {
  const navigate = useNavigate();
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
        <img src={logo} className="standard-padding" />
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

        <p className="white">{APP_NAME} &copy;2022</p>
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
              logout();
            }}>
              Logout
            </a>
          ),
        },
      ]}
    />
  )

  const menuItems = [{
    key: '/',
    label: <><ScanOutlined /> 3D Map</>,
    onClick: () => navigate("/"),
  },
  {
    key: '/sensorData',
    label: <><FundViewOutlined /> 2D Map</>,
    onClick: () => navigate("/sensorData"),
  },
  {
    key: '/videos',
    label: <><VideoCameraFilled /> Video Streams</>,
    onClick: () => navigate("/videos"),
  }]

  return (
    <div className="App">
      <Layout>
        <Header>
          <Menu
            // theme="dark"
            mode="horizontal"
          >
            <Menu.Item key={''}>
              <img
                src={logo}
                className="header-logo pointer"
                onClick={() => navigate("/")}
              />
            </Menu.Item>
            <span>
              <CheckCircleTwoTone twoToneColor="#52c41a" />&nbsp;
              <span className="green">Connected</span>
            </span>

            <span style={{ marginLeft: 'auto' }}>
              {user && <Dropdown overlay={userMenu} className="pointer">
                <span className="pointer">
                  <Avatar size="large" src={user.photoURL} />
                  &nbsp;{user.displayName}&nbsp;
                </span>
              </Dropdown>}
              &nbsp;
            </span>
          </Menu>
          <Menu mode="horizontal"
            selectedKeys={[window.location.pathname]}
            items={menuItems}
          >
            {/* <Menu.Item key={'/notifications'} onClick={() => navigate("/notifications")}>
              <NotificationFilled /> Alerts
            </Menu.Item> */}

          </Menu>
        </Header>
        <Layout>
          <Content>
            <div style={{ height }}>
              <Routes>
                <Route path="/" element={<Map user={user} />} />
                <Route path="/lidar" element={<Map user={user} />} />
                <Route path="/videos" element={<VideoStreams user={user} />} />
                <Route path="/videos/:cameraId" element={<VideoStreams user={user} />} />
                <Route path="/sensorData" element={<SensorData user={user} />} />

                {/* <Route
                  path="/notifications"
                  element={<Notifications user={user} />}
                /> */}
              </Routes>
            </div>
          </Content>
        </Layout>
        <Footer>

        </Footer>
      </Layout>
    </div>
  );
}
