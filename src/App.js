import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Avatar, Button, Dropdown, Layout, Menu, Select, Spin } from "antd";
import {
  CheckCircleTwoTone,
  GoogleOutlined,
  NotificationFilled,
  VideoCameraFilled,
} from "@ant-design/icons";

import { APP_DESC, APP_NAME } from "./util/constants";
import logo from "./assets/logo_white.png";

import "antd/dist/antd.css";
import "./styles.css";
import Home from "./components/Home";
import Map from "./components/Map";
import Notifications from "./components/Notifications";
import VideoStreams from "./components/VideoStreams";
import { useLogin } from "./firebase/useLogin";

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

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
        <br/><br/><br/>
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
        <br/>
        <br/>

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

  return (
    <div className="App">
      <Layout>
        <Header>
          <Menu
            // theme="dark"
            mode="horizontal"
          >
            <Menu.Item key={0}>
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
            {user && <Dropdown overlay={userMenu}  className="pointer">
            <span className="pointer">
              <Avatar size="large" src={user.photoURL} />
              &nbsp;{user.displayName}&nbsp;
            </span>
            </Dropdown>}
&nbsp;
         

              </span> 
          </Menu>
        </Header>
        <Layout>
          <Content>
            <div style={{ height }}>
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/maps" element={<Map user={user} />} />
                <Route path="/video" element={<VideoStreams user={user} />} />
                <Route
                  path="/notifications"
                  element={<Notifications user={user} />}
                />
              </Routes>
            </div>
          </Content>
        </Layout>
        <Footer>
          <Menu mode="horizontal" defaultSelectedKeys={[1]}>
            <Menu.Item key={0} onClick={() => navigate("/")}>
              {APP_NAME} | &copy;2022
            </Menu.Item>
            <Menu.Item key={1} onClick={() => navigate("/maps")}>
              <GoogleOutlined /> Maps
            </Menu.Item>

            <Menu.Item key={2} onClick={() => navigate("/video")}>
              <VideoCameraFilled /> Video Streams
            </Menu.Item>

            <Menu.Item key={3} onClick={() => navigate("/notifications")}>
              <NotificationFilled /> Notifications
            </Menu.Item>
          </Menu>
        </Footer>
      </Layout>
    </div>
  );
}
