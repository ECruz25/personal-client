import React, { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Layout, Row, Col, Input } from "antd";
import QRCode from "qrcode.react";
import PlantProps from "../types/PlantProps";
import axios from "axios";
import PlantWateringProps from "../types/PlantWateringProps";
import Table from "../Components/Table";
import TableColumnProps from "../types/TableColumnsProps";

const { Content } = Layout;

const PlantWatering: FC = () => {
  const location = window.location.href;
  const navigate = useNavigate();
  const params = useParams();
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [plantWatering, setPlantWatering] = useState<PlantWateringProps[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantProps>();

  const loadPlants = async () => {
    const { data } = await axios.get(
      "http://localhost:5006/api/plant-services/plant"
    );
    setPlants(data);

  };

  const loadPlantWatering = async () => {
    const { data } = await axios.get(
      "http://localhost:5006/api/plant-services/watering"
    );
    setPlantWatering(data);
  }

  const onCreatePlant = async (values: any) => {
    await axios.post("http://localhost:5006/api/plant-services/plant", values);
    loadPlants();
  };

  useEffect(() => {
    loadPlants();
    loadPlantWatering();
  }, []);

  useEffect(() => {
    if (params && params.plantId) {
      const plant = plants.find(pl => pl.id.toString() === params.plantId);
      setSelectedPlant(plant);
    }
    else {
      setSelectedPlant(undefined);
    }
  }, [params, plants])

  const columns: TableColumnProps[] = [
    { key: "type", title: "Type", dataIndex: "type" },
    { key: "location", title: "Location", dataIndex: "location" },
  ];

  const wateringColumns: TableColumnProps[] = [
    { key: "date", title: "Date", dataIndex: "date" },
  ]

  const onRow = (record: any, rowIndex: any) => {
    return {
      onClick: () => {
        navigate(`/plants-watering/${record.id}`);
        setSelectedPlant(record);
      },
    };
  };

  return (
    <Content style={{ marginTop: 30 }}>
      <Row>
        <Col>
          {selectedPlant && <QRCode value={`${location}/${selectedPlant.id}`} />}
        </Col>
      </Row>
      <Row>
        <Col>
          {
            selectedPlant &&
            <Table columns={wateringColumns} items={plantWatering} />
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onCreatePlant}
            autoComplete="off"
          >
            <Form.Item label="Type" name="type">
              <Input />
            </Form.Item>
            <Form.Item label="Location" name="location">
              <Input />
            </Form.Item>
            <Form.Item label="Days between watering" name="daysBetweenWatering">
              <Input type="number" suffix="dias" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col>
          <Table columns={columns} items={plants} onRow={onRow} />
        </Col>
      </Row>
    </Content>
  );
};
export default PlantWatering;
