import React, { FC } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UploadFileProps from "../types/UploadFileProps";

const UploadFile: FC<UploadFileProps> = ({ onChange, beforeUpload }) => {
  return (
    <Upload onChange={onChange} beforeUpload={beforeUpload}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};

export default UploadFile;
