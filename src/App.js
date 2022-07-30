
import React, {useEffect, useState} from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout, Menu, Select } from 'antd';
import { CheckCircleTwoTone, GlobalOutlined, NotificationFilled, NotificationOutlined, VideoCameraFilled, VideoCameraOutlined,  } from '@ant-design/icons';


import { APP_NAME } from "./util/constants";
import logo from "./assets/logo_white.png";

import 'antd/dist/antd.css';
import "./styles.css";
import PointCloud from './components/PointCloud';
import Home from './components/Overview';
import Map from './components/Map';
import Notifications from './components/Notifications';
import VideoStreams from './components/VideoStreams';

const { Header, Footer, Sider, Content } = Layout;
const {Option} = Select


export default function App() {
  const navigate = useNavigate();

  const height = window.innerHeight - 135;

  return <div className='App'><Layout>
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

          

            <span className='float-right'>
                    &nbsp;Status:&nbsp;<CheckCircleTwoTone twoToneColor="#52c41a" /><span className='green'>&nbsp;Connected</span>
              </span>


        </Menu>
  </Header>
  <Layout>
    <Content>
      <div style={{height}}>
    <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/maps" element={<Map />}/>
            <Route path="/video" element={<VideoStreams />}/>
            <Route path="/notifications" element={<Notifications />}/>
    </Routes>
      </div>
    </Content>
  </Layout>
  <Footer>

    <Menu
      mode="horizontal"
      defaultSelectedKeys={[1]}
    >
    <Menu.Item  key={0} onClick={() => navigate("/")}>
    {APP_NAME} | &copy;2022
      </Menu.Item>
    <Menu.Item  key={1} onClick={() => navigate("/maps")}>
             <GlobalOutlined/> Maps
            </Menu.Item>
            
            <Menu.Item key={2} onClick={() => navigate("/video")}>
             <VideoCameraFilled/> Video Streams
            </Menu.Item>

            <Menu.Item key={3} onClick={() => navigate("/notifications")}>
              <NotificationFilled/> Notifications
            </Menu.Item>
    </Menu>
    </Footer>
</Layout>
</div> 
}
