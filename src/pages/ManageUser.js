import React, { useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import LayoutPage from "../layout/LayoutPage";

const { Search } = Input;

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
  },
];

const data = [
  {
    key: "1",
    staffCode: "A",
    fullName: "John Brown",
    userName: "asd123",
    joinedDate: "11/06/2024",
    type: "Staff",
  },
  {
    key: "2",
    staffCode: "B",
    fullName: "John Brown",
    userName: "asd123",
    joinedDate: "11/06/2024",
    type: "Staff",
  },
  {
    key: "3",
    staffCode: "C",
    fullName: "John Brown",
    userName: "asd123",
    joinedDate: "11/06/2024",
    type: "Staff",
  },
];

const ManageUser = () => {
  const [type, setType] = useState("Type");
  const sorterLog = () => {
    console.log("Sorted");
  };

  const columns = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      key: "name",
      width: "18%",
      sorter: () => sorterLog(),
      render: (text) => <a href="#">{text}</a>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "name",
      width: "18%",
      sorter: () => sorterLog(),

      render: (text) => <a>{text}</a>,
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "username",
      width: "18%",
    },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      key: "joinedDate",
      width: "18%",
      sorter: () => sorterLog(),
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
      width: "18%",
      sorter: () => sorterLog(),
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <a>Edit {record.name}</a>
          <a>Disable</a>
        </Space>
      ),
    },
  ];

  return (
    <LayoutPage>
      <div className="w-full">
        <h1 className="font-bold text-d6001c text-2xl">User List</h1>
        <div className="flex items-center justify-between mt-5">
          <Space.Compact>
            <Input disabled={true} value={type} className="w-[300px]" />
            <FilterOutlined onClick={() => { setType("Nothing") }} className="h-[32px] w-[32px] items-center justify-center border-2" />
          </Space.Compact>
          <div className="flex gap-10">
            <Space.Compact>
              <Search className="w-[300px]" />
            </Space.Compact>
            <Button
              className="flex items-center w-[300px] h-[32px] bg-d6001c"
              type="primary"
              size="large"
            >
              Create new user
            </Button>
          </div>
        </div>
        <Table className="mt-10" columns={columns} dataSource={data} />
      </div>
    </LayoutPage>
  );
};

export default ManageUser;
