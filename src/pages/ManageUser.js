import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import { Button, Input, Space, Table, Modal, Select, Pagination, message } from "antd";
import { removeExtraWhitespace } from "../ultils/helpers/HandleString";
import {
  FilterOutlined,
  EditFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import LayoutPage from "../layout/LayoutPage";
import "../styles/ManageUser.css";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const itemRender = (_, type, originalElement) => {
  if (type === 'prev') {
    return <span>Previous</span>;
  }
  if (type === 'next') {
    return <span>Next</span>;
  }
  return originalElement;
};

// const data = [
//   {
//     key: "1",
//     staffCode: "A",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "2",
//     staffCode: "B",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "3",
//     staffCode: "C",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "4",
//     staffCode: "A",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "5",
//     staffCode: "B",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "6",
//     staffCode: "C",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "7",
//     staffCode: "A",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "8",
//     staffCode: "B",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "9",
//     staffCode: "C",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "10",
//     staffCode: "A",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "11",
//     staffCode: "B",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "12",
//     staffCode: "C",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "13",
//     staffCode: "A",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "14",
//     staffCode: "B",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
//   {
//     key: "15",
//     staffCode: "C",
//     fullName: "John Brown",
//     userName: "asd123",
//     joinedDate: "11/06/2024",
//     type: "Staff",
//     location: "HN",
//   },
// ];

const ManageUser = () => {
  const [type, setType] = useState("Type");
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const sorterLog = () => {
    console.log("Sorted");
  };

  const handleClicked = (row) => {
    setModalData(row);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalData({});
  };

  const handleSearch = (value) => {
    console.log("Search query:", value);
  };

  useEffect(() => {
    axiosInstance
      .post("/Users/search")
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
          console.log(res.data)
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, []);

  const columns = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      key: "name",
      width: "18%",
      sorter: () => sorterLog(),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "name",
      width: "18%",
      sorter: () => sorterLog(),

      render: (text) => <span>{text}</span>,
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
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalVisible(false);
              navigate("edit-user");
            }}
          >
            <EditFilled className="text-lg mb-1" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalVisible(false);
              navigate("edit-user");
            }}
          >
            <CloseCircleOutlined className="text-red-600 text-lg mb-1" />
          </Button>
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
            <Select
              open={open}
              defaultValue={type}
              onClick={() => setOpen(!open)}
              suffixIcon={<FilterOutlined onClick={() => setOpen(!open)} />}
              className="w-[100px]"
              onChange={(value) => setType(value)}
              onSelect={() => setOpen(!open)}
              options={[
                {
                  value: "Type",
                  label: "All",
                },
                {
                  value: "1",
                  label: "Admin",
                },
                {
                  value: "0",
                  label: "Staff",
                },
              ]}
            />
          </Space.Compact>
          <div className="flex gap-10">
            <Space.Compact>
              <Search
                className="w-[300px]"
                value={searchQuery}
                allowClear
                maxLength={100}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={(e) =>
                  setSearchQuery(removeExtraWhitespace(e.target.value))
                }
                onSearch={() => {
                  if (searchQuery.length > 0) {
                    handleSearch(searchQuery);
                  }
                }}
              />
            </Space.Compact>
            <Button
              className="flex items-center w-[300px] h-[32px] bg-d6001c"
              type="primary"
              size="large"
              onClick={() => {
                navigate("create-user");
              }}
            >
              Create new user
            </Button>
          </div>
        </div>
        <div className="justify-center items-center gap-2">
          <Table
            pagination={false}
            className="mt-10"
            columns={columns}
            dataSource={data}
            onRow={(record) => {
              return {
                onClick: () => {
                  handleClicked(record);
                },
              };
            }}
          />
          <Pagination
            className="text-center text-d6001c border-b-2"
            defaultCurrent={pageNumber}
            defaultPageSize={15}
            total={30}
            onChange={(page) => setPageNumber(page)}
            itemRender={itemRender}
          />
        </div>
        <Modal
          title={
            <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
              Detailed Assignment Information
            </h3>
          }
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          className="custom-modal"
        >
          <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Staff Code:</span>
              <span>{modalData?.staffCode}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Full Name:</span>
              <span>{modalData?.fullName}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Username:</span>
              <span>{modalData?.userName}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Joined Date:</span>
              <span>{modalData?.joinedDate}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Type:</span>
              <span>{modalData?.type}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Location:</span>
              <span>{modalData?.location}</span>
            </div>
          </div>
        </Modal>
      </div>
    </LayoutPage>
  );
};

export default ManageUser;
