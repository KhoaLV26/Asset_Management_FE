import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import { BsChevronExpand } from "react-icons/bs";
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

const ManageUser = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState(true)
  const [modalData, setModalData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [params, setParams] = useState({
      location: "a401fd2b-c5a7-44f5-b614-1e861a2ac7b9",
      searchTerm: searchQuery,
      role: "",
      sortBy: "StaffCode",
      sortDirection: "asc",
      pageNumber: 1,
      pageSize: 15,
    }
  )

  const sorterLog = (name) => {
    if (params.sortBy === name) {
      if (direction === true) {
        setParams(prev => ({...prev, sortDirection: "desc"}))
      }
      else {
        setParams(prev => ({...prev, sortDirection: "asc"})) 
      }
      setDirection(!direction)
    }
    else {
      setParams(prev => ({...prev, sortBy: name})); 
      setDirection(true);
      setParams(prev => ({...prev, sortDirection: "asc"}))   
    }
    
  }
    
  const handleClicked = (row) => {
    setModalData(row);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalData({});
  };

  const handleSearch = (value) => {
    setParams(prev => ({...prev, searchTerm: value}))
  };

  useEffect(() => {
    axiosInstance
      .get(`/Users/search?location=${params.location}&searchTerm=${params.searchTerm}&role=${params.role}&sortBy=${params.sortBy}&sortDirection=${params.sortDirection}&pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`)
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data.map(user => ({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`
          })));
          setTotal(res.data.totalCount)
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, [params]);

  const columns = [
    {
      title: (
        <span className="flex items-center justify-between">
          Staff Code <BsChevronExpand className="w-[15px] h-[15px]"/>
        </span>
      ),
      dataIndex: "staffCode",
      key: "staffcode",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("StaffCode")
        }}),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Full Name <BsChevronExpand className="w-[15px] h-[15px]"/>
        </span>
      ),
      dataIndex: "fullName",
      key: "name",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("")
        }}),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Username
        </span>
      ),
      dataIndex: "username",
      key: "username",
      width: "18%",
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Joined Date <BsChevronExpand className="w-[15px] h-[15px]"/>
        </span>
      ),
      dataIndex: "dateJoined",
      key: "dateJoined",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("JoinedDate")
        }}),
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Type <BsChevronExpand className="w-[15px] h-[15px]"/>
        </span>
      ),
      key: "roleName",
      dataIndex: "roleName",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Role")
        }}),
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
              defaultValue={"All"}
              onClick={() => setOpen(!open)}
              suffixIcon={<FilterOutlined onClick={() => setOpen(!open)} />}
              className="w-[100px]"
              onChange={(value) => setParams(prev => ({...prev, role: value}))}
              onSelect={() => setOpen(!open)}
              options={[
                {
                  value: "",
                  label: "All",
                },
                {
                  value: "Admin",
                  label: "Admin",
                },
                {
                  value: "Staff",
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
                  if (searchQuery.length > -1) {
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
            defaultPageSize={15}
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
            defaultCurrent={params.pageNumber}
            defaultPageSize={15}
            total={total}
            onChange={(page) =>  setParams(prev => ({...prev, pageNumber: page}))
          }
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
              <span>{modalData?.username}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Joined Date:</span>
              <span>{modalData?.dateJoined}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Type:</span>
              <span>{modalData?.roleName}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Location:</span>
              <span>{modalData?.locationName}</span>
            </div>
          </div>
        </Modal>
      </div>
    </LayoutPage>
  );
};

export default ManageUser;
