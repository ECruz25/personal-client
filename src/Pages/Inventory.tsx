import React, { FC, useState, useEffect } from "react";
import { Layout } from "antd";
import Table from "../Components/Table";
import CustomButton from "../Components/Button";
import TableColumnProps from "../types/TableColumnsProps";
import CreatePurchaseForm from "../Components/CreatePurchaseForm";
import ProductProps from "../types/ProductProps";
const { Content } = Layout;

const Inventory: FC = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] =
    useState<Boolean>(false);

  const fetchData = async () => {
    try {
      const result = await fetch(
        "http://localhost:5001/api/inventory-services"
      );
      const data = await result.json();
      setProducts(data);
      console.table(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const switchNewOrderModalVisibility = () => {
    setIsNewOrderModalOpen(!isNewOrderModalOpen);
  };

  const columns: TableColumnProps[] = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Cantidad", dataIndex: "Amount", key: "Amount" },
    { title: "Proveedor", dataIndex: "supplier", key: "supplier" },
  ];

  return (
    <Content>
      <div style={{ display: "flex", margin: 15, marginBottom: 30 }}>
        <CustomButton
          display="Create Order"
          onClick={switchNewOrderModalVisibility}
        />
      </div>
      <Table columns={columns} items={products} />
      {isNewOrderModalOpen && (
        <CreatePurchaseForm
          fetchProducts={fetchData}
          products={products}
          closeModal={switchNewOrderModalVisibility}
        />
      )}
    </Content>
  );
};
export default Inventory;
