import React, { useState } from "react";
import { Button, Input, Space, Table, Modal } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import LayoutPage from "../layout/LayoutPage";
import '../styles/ManageUser.css';

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
    location: "HN",
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  const sorterLog = () => {
    console.log("Sorted");
  };

  const handleClicked = (row) => {
    setModalData(row);
    setIsModalVisible(true);  }

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalData({});
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
        <Table className="mt-10" columns={columns} dataSource={data} onRow={(record) => {
            return {
              onClick: () => {
                handleClicked(record);
              },
            };
          }}/>
        <Modal
          title={<h3 className="modal-title w-full border-b-2">Detailed Assignment Information</h3>}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          className="custom-modal"
        >
          <div className="modal-content">
            <div className="modal-row">
              <span className="modal-label">Staff Code:</span> {modalData.staffCode}
            </div>
            <div className="modal-row">
              <span className="modal-label">Full Name:</span> {modalData.fullName}
            </div>
            <div className="modal-row">
              <span className="modal-label">Username:</span> {modalData.userName}
            </div>
            <div className="modal-row">
              <span className="modal-label">Joined Date:</span> {modalData.joinedDate}
            </div>
            <div className="modal-row">
              <span className="modal-label">Type:</span> {modalData.type}
            </div>
          </div>
        </Modal>
      </div>
    </LayoutPage>
  );
};

export default ManageUser;
