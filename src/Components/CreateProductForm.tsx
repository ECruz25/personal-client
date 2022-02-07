import React, { useState, FC } from "react";
import { Input } from "antd";
import CustomButton from "./Button";
import CreateProductFormProps from "../types/CreateProductFormProps";

const CreateProductForm : FC<CreateProductFormProps> = ({ submit }) => {
  const [name, setName] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const onChangeName = (event: any) => {
    setName(event.target.value);
  };

  const onChangeCost = (event: any) => {
    setCost(event.target.value);
  };

  const onChangePrice = (event: any) => {
    setPrice(event.target.value);
  };

  const onChangeQuantity = (event: any) => {
    setQuantity(event.target.value);
  };

  const createProduct = () => {
    submit({ id:"", cost, name, price, quantity, supplier: "" })
  }

  return (
    <div>
      <Input style={{ width: 250 }} value={name} onChange={onChangeName} />
      <Input
        style={{ width: 100 }}
        value={quantity}
        onChange={onChangeQuantity}
      />
      <Input style={{ width: 100 }} value={cost} onChange={onChangeCost} />
      <Input style={{ width: 100 }} value={price} onChange={onChangePrice} />
      <CustomButton display="Create" onClick={createProduct} />
    </div>
  );
};

export default CreateProductForm;
