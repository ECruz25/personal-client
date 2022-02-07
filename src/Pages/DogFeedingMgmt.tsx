import React, { useCallback, useEffect, useState } from "react";
import { Table, Layout, Row, Col, Form, Input, Button, Select } from "antd";
import DogProps from "../types/DogProps";
import axios from "axios";
import DogWeightProps from "../types/DogWeightProps";
import DogFeedingProps from "../types/DogFeedingsProps";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import DogWeightChartProps from "../types/DogWeightsChartProps";
import StyledDogFeeding from "../Components/styled/StyledDogFeeding";
import { BrowserView, MobileView } from "react-device-detect";
const { Content } = Layout;
const { Option } = Select;

const DogFeedingMgmt = () => {
  const [dogs, setDogs] = useState<DogProps[]>([]);
  const [dogWeights, setDogWeights] = useState<DogWeightProps[]>([]);
  const [dogFeeds, setDogFeeds] = useState<DogFeedingProps[]>([]);
  const [weightChartData, setWeightChartData] = useState<DogWeightChartProps[]>(
    []
  );

  const onLoadDogs = async () => {
    const result = await fetch("http://localhost:5005/api/dog-services/dog");
    const data = await result.json();
    setDogs(data);
  };

  const onLoadDogWeights = async () => {
    const result = await fetch(
      "http://localhost:5005/api/dog-services/weight-transactions"
    );
    const data = await result.json();
    setDogWeights(
      data.map((dw: any) => ({ ...dw, date: new Date(dw.dateTime) }))
    );
  };

  const memoizedGetDog = useCallback(
    (dogId: number) => {
      const getDog = (dogId: number) => {
        const d = dogs.find((dog) => dog.id === dogId);
        return d;
      };
      return getDog(dogId);
    },
    [dogs]
  );

  const memoizedCallback2 = useCallback(() => {
    const onLoadDogFeeds = async () => {
      const result = await fetch(
        "http://localhost:5005/api/dog-services/feedings"
      );
      const data = await result.json();
      setDogFeeds(
        data.map((dg: any) => ({ ...dg, name: memoizedGetDog(dg.dogId)?.name }))
      );
    };
    onLoadDogFeeds();
  }, [memoizedGetDog]);

  const memoizedCallback = useCallback(() => {
    const getWeightByName = (name: string, date: string): number => {
      const dog = dogs.find((d) => d.name === name);
      if (!dog) return 0;
      const dogWeight = dogWeights.find(
        (dw) => dw.dogId === dog.id && dw.date.toDateString() === date
      );
      return dogWeight?.weight ?? 0;
    };
    const getWeightsChartData = () => {
      const data: string[] = dogWeights.map((dogWeight) =>
        dogWeight.date.toDateString()
      );
      const chartData: DogWeightChartProps[] = data
        .filter((c, index) => data.indexOf(c) === index)
        .map((c) => ({
          date: c,
          lorenzo: getWeightByName("Lorenzo", c),
          charlie: getWeightByName("Charlie", c),
          lucrecia: getWeightByName("Lucrecia", c),
        }));
      setWeightChartData(chartData);
    };
    getWeightsChartData();
  }, [dogWeights, dogs]);

  useEffect(() => {
    onLoadDogs();
    onLoadDogWeights();
  }, []);

  useEffect(() => {
    memoizedCallback2();
  }, [dogs, memoizedCallback2]);

  useEffect(() => {
    memoizedCallback();
  }, [dogWeights, memoizedCallback]);

  async function onFinishWeightInForm(values: any) {
    await axios.post(
      "http://localhost:5005/api/dog-services/weight-transactions",
      values
    );
  }

  const onFinishFeedingForm = async (values: any) => {
    await axios.post("http://localhost:5005/api/dog-services/feedings", values);
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date", width: 150 },
    { title: "Dog", dataIndex: "name", key: "name" },
    { title: "Served", dataIndex: "served", key: "served" },
    { title: "Left", dataIndex: "left", key: "left" },
    { title: "Ate", dataIndex: "ate", key: "ate" },
  ];

  const getDogFeedingForm = () => {
    return (
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinishFeedingForm}
        autoComplete="off"
      >
        <Form.Item label="Dog" name="dog">
          <Select>
            {dogs.map((dog) => (
              <Option key={dog.id}>{dog.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Served Food" name="served">
          <Input suffix="g" />
        </Form.Item>
        <Form.Item label="Left Food" name="left">
          <Input suffix="g" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Content>
      <StyledDogFeeding>
        <BrowserView>
          <Row>
            <Col>{getDogFeedingForm()}</Col>
            <Col span={18}>
              <Table
                columns={columns}
                dataSource={dogFeeds}
                scroll={{ y: 500 }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinishWeightInForm}
                autoComplete="off"
              >
                <Form.Item label="Dog" name="dog">
                  <Select style={{ width: 120 }}>
                    {dogs.map((dog) => (
                      <Option key={dog.id}>{dog.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Weight"
                  name="weight"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={18}>
              <LineChart
                width={500}
                height={300}
                data={weightChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="lorenzo"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="charlie" stroke="#82ca9d" />
                <Line type="monotone" dataKey="lucrecia" stroke="#82ca9d" />
              </LineChart>
            </Col>
          </Row>
        </BrowserView>
        <MobileView>
          <Row>
            <Col>{getDogFeedingForm()}</Col>
          </Row>
          <Row>
            <Col>
              <Table
                columns={columns}
                dataSource={dogFeeds}
                scroll={{ y: "30vh", x: 500 }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinishWeightInForm}
                autoComplete="off"
              >
                <Form.Item label="Dog" name="dog">
                  <Select style={{ width: 120 }}>
                    {dogs.map((dog) => (
                      <Option key={dog.id}>{dog.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Weight"
                  name="weight"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <LineChart
                width={350}
                height={300}
                data={weightChartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="lorenzo"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="charlie" stroke="#82ca9d" />
                <Line type="monotone" dataKey="lucrecia" stroke="#82ca9d" />
              </LineChart>
            </Col>
          </Row>
        </MobileView>
      </StyledDogFeeding>
    </Content>
  );
};

export default DogFeedingMgmt;
