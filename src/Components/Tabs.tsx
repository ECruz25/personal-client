import React, { FC } from "react";
import { Tabs, Card } from "antd";
import { Meta } from "antd/lib/list/Item";
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const products = [
  { name: "Cemento", price: 240, img: "cemento.png" },
  { name: "B. de cemento", price: 40, img: "bloque.jpg" },
  { name: "Pala 1", price: 340, img: "pala.jpg" },
  { name: "Martillo", price: 80, img: "martillo.jpg" },
];

const CustomTabs: FC = () => {
  return (
    <Tabs defaultActiveKey="0">
      <TabPane
        tab="Todo"
        key="0"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {products.map((product) => (
          <Card
            hoverable
            style={{ width: 160, margin: 10 }}
            cover={
              <img alt="example" src={product.img} style={{ height: 140 }} />
            }
            actions={[<PlusCircleOutlined />]}
          >
            <Meta
              title={product.name}
              description={`L. ${product.price.toFixed(2)}`}
            />
            <PlusOutlined />
          </Card>
        ))}
      </TabPane>
      <TabPane tab="Fontanería" key="1">
        Fontaneria
      </TabPane>
      <TabPane tab="Jardinería" key="2">
        Jardineria
      </TabPane>
    </Tabs>
  );
};

export default CustomTabs;
