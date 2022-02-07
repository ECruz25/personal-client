import React, { FC } from "react";
import { Table } from "antd";
import TableProps from "../types/TableProps";

const CustomTable: FC<TableProps> = ({ onRow, columns, items }) => {
  return <Table columns={columns} dataSource={items} onRow={onRow} />;
};

export default CustomTable;
