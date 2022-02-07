import React, { FC } from "react";
import { Button } from "antd";

const CustomButton: FC<{ display: string; onClick: () => void }> = ({
  display,
  onClick,
}) => {
  return <Button onClick={onClick}>{display}</Button>;
};

export default CustomButton;
