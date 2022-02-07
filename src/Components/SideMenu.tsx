import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Sider from "antd/lib/layout/Sider";
import MenuProps from "../types/MenuProps";

const { SubMenu } = Menu;

const SideMenu: FC<MenuProps> = ({ isMobile = false }) => {
  const mode = () => {
    if (isMobile) return "horizontal"
    return "inline"
  }
  return (
    <Sider width={isMobile ? 400 : 50}>
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode={mode()}>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          <Link to="/dog-feeding-mgt">Dogs</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<DesktopOutlined />}>
          <Link to="/plants-watering">Plants</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="ERP">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/inventory">Inventory</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideMenu;
