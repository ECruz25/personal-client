import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Button, Input, Modal, Select, Typography } from "antd";
import CustomButton from "../Components/Button";
import Table from "../Components/Table";
import { PlusOutlined } from "@ant-design/icons";
import ProductProps from "../types/ProductProps";
import TableColumnProps from "../types/TableColumnsProps";
import CreateProductForm from "./CreateProductForm";
import CreatePurchaseFormProps from "../types/CreatePurchaseFormProps";
import UploadFile from "./UploadFile";
const xlsxParser = require("xlsx-parse-json");

const { Option } = Select;
const { Text } = Typography;

const columns: TableColumnProps[] = [
  { title: "Nombre", dataIndex: "name", key: "name" },
  { title: "Cantidad", dataIndex: "quantity", key: "quantity" },
  { title: "Costo", dataIndex: "cost", key: "cost" },
  { title: "Precio", dataIndex: "price", key: "price" },
  { title: "Costo total", dataIndex: "totalCost", key: "totalCost" },
  { title: "Precio total", dataIndex: "totalPrice", key: "totalPrice" },
];

const CreatePurchaseForm: FC<CreatePurchaseFormProps> = ({
  products,
  fetchProducts,
  closeModal,
}) => {
  const [isCreatingNewProduct, setIsCreatingNewProduct] =
    useState<boolean>(false);
  const [purchasedProducts, setPurchasedProducts] = useState<ProductProps[]>(
    []
  );
  const [supplier, ] = useState<string>("Importadora Millenium");
  const [selectedProduct, setSelectedProduct] = useState<ProductProps>();
  const [cost, setCost] = useState<number>(selectedProduct?.cost || 0);
  const [price, setPrice] = useState<number>(selectedProduct?.price || 0);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    setSelectedProduct(products[0]);
  }, [products]);

  const addItem = () => {
    const newItem: ProductProps = {
      cost: cost || 0,
      supplier: supplier || "",
      id: selectedProduct?.id || "",
      name: selectedProduct?.name || "",
      price: price || 0,
      quantity: quantity || 0,
    };
    const products = purchasedProducts.concat(newItem);
    setPurchasedProducts(products);
    setCost(0);
    setQuantity(0);
  };

  const onChangeSelectedProduct = (key: string) => {
    const product = products.find((prod) => prod.id === key);
    if (product) setSelectedProduct(product);
  };

  const createProduct = async (product: ProductProps) => {
    const productWithSupplier = { ...product, supplier };
    const productExists = products.find((p) => p.name === product.name);
    if (!productExists) {
      const { data } = await axios.post(
        "http://localhost:5002/api/product-services/create",
        productWithSupplier
      );
      const products = purchasedProducts.concat(data);
      setIsCreatingNewProduct(false);
      setPurchasedProducts(products);
      fetchProducts();
    }
  };

  const createOrder = async () => {
    await axios.post("http://localhost:5001/api/inventory-services/create", {
      data: purchasedProducts,
    });
  };

  const handlePreview = async (file: any) => {
    const data = await xlsxParser.onFileSelection(file);
    const productsPurchased: ProductProps[] = Object.keys(data)
      .map((supplierName) => {
        const productsBySupplier: ProductProps[] = data[supplierName].map(
          (product: any) => {
            const exists = products.find(
              (p) => p.name.toLowerCase() === product.Name.toLowerCase()
            );
            const newProduct: ProductProps = {
              cost: product.Cost ?? 0,
              id: exists?.id ?? "",
              name: exists?.name ?? product.Name ?? "",
              price: product.Price ?? 0,
              quantity: product.Quantity ?? 0,
              supplier: supplierName,
            };
            return newProduct;
          }
        );
        return productsBySupplier;
      })
      .flat();
    const uncreatedProducts = productsPurchased.filter(
      (product) => product.id === ""
    );
    const { data: createdProducts } = await axios.post(
      "http://localhost:5002/api/product-services/create-multiple",
      { products: uncreatedProducts }
    );
    const confirmedProducts: ProductProps[] = productsPurchased.map((pro) => {
      if (pro.id !== "") {
        return pro;
      }
      const id = createdProducts.find(
        (t: { Name: string }) => t.Name === pro.name
      ).Id;
      return { ...pro, id };
    });
    const products1 = purchasedProducts.concat(confirmedProducts);
    setPurchasedProducts(products1);
  };

  const handleChange = async (file: any) => {};
  return (
    <Modal
      title="Create Order"
      visible
      onCancel={closeModal}
      onOk={createOrder}
      width={800}
    >
      <div>
        <CustomButton
          display="Create Product"
          onClick={() => {
            setIsCreatingNewProduct(true);
          }}
        />
        <UploadFile
          beforeUpload={handlePreview}
          onChange={handleChange}
        ></UploadFile>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>Producto</Text>
          <Select
            defaultValue={products[0]?.id}
            value={selectedProduct?.id}
            style={{ width: 250 }}
            disabled={isCreatingNewProduct}
            onChange={onChangeSelectedProduct}
          >
            {products.map(
              (product: ProductProps): JSX.Element => (
                <Option value={product.id}>{product.name}</Option>
              )
            )}
          </Select>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>Cantidad</Text>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: 100 }}
            disabled={isCreatingNewProduct}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>Costo</Text>
          <Input
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            style={{ width: 100 }}
            disabled={isCreatingNewProduct}
            prefix="L. "
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>Precio</Text>
          <Input
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ width: 100 }}
            disabled={isCreatingNewProduct}
            prefix="L. "
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>Create</Text>
          <Button icon={<PlusOutlined />} type="primary" onClick={addItem} />
        </div>
      </div>
      {isCreatingNewProduct && <CreateProductForm submit={createProduct} />}
      <Table
        columns={columns}
        items={purchasedProducts.map((product) => ({
          ...product,
          totalCost: product.quantity * product.cost,
          totalPrice: product.quantity * product.price,
        }))}
      />
    </Modal>
  );
};

export default CreatePurchaseForm;
