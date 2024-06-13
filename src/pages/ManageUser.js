import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Select,
  Pagination,
  message,
  Empty,
} from "antd";
import { removeExtraWhitespace } from "../ultils/helpers/HandleString";
import {
  FilterOutlined,
  EditFilled,
  CloseCircleOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import LayoutPage from "../layout/LayoutPage";
import "../styles/ManageUser.css";
import { useNavigate, useLocation } from "react-router-dom";

const { Search } = Input;

const itemRender = (_, type, originalElement) => {
  if (type === "prev") {
    return <span>Previous</span>;
  }
  if (type === "next") {
    return <span>Next</span>;
  }
  return originalElement;
};

const ManageUser = () => {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState(true);
  const [modalData, setModalData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [nameType, setNameType] = useState("FullName");
  const navigate = useNavigate();
  const location = useLocation();
  const newUser = location?.state?.data;
  const [params, setParams] = useState({
    location: "cde5153d-3e0d-4d8c-9984-dfe6a9b8c2b1",
    searchTerm: searchQuery,
    role: "",
    sortBy: "StaffCode",
    sortDirection: "asc",
    pageNumber: 1,
    pageSize: 15,
  });

  const updateList = (newObject) => {
    const index = data.findIndex(
      (obj) => obj.staffCode === newObject.staffCode
    );

    if (index !== -1) {
      const newData = [...data];
      const foundObject = newData.splice(index, 1)[0];
      newData.unshift(foundObject);
      setData(newData);
    } else {
      const newData = [newObject, ...data.slice(0, data.length - 1)];
      setData(newData);
    }
  };

  const sorterLog = (name) => {
    if (params.sortBy === name) {
      if (direction === true) {
        setParams((prev) => ({ ...prev, sortDirection: "desc" }));
      } else {
        setParams((prev) => ({ ...prev, sortDirection: "asc" }));
      }
      setDirection(!direction);
    } else {
      setParams((prev) => ({ ...prev, sortBy: name }));
      setDirection(true);
      setParams((prev) => ({ ...prev, sortDirection: "asc" }));
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalData({});
  };

  const handleSearch = (value) => {
    setParams((prev) => ({
      ...prev,
      searchTerm: removeExtraWhitespace(value),
    }));
  };

  useEffect(() => {
    axiosInstance
      .get(
        `/Users/search?location=${params.location}&searchTerm=${params.searchTerm}&role=${params.role}&sortBy=${params.sortBy}&sortDirection=${params.sortDirection}&pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`
      )
      .then((res) => {
        if (res.data.success) {
          setData(
            res.data.data.map((user) => ({
              ...user,
              fullName: `${user.firstName} ${user.lastName}`,
            }))
          );
          (newUser && (params.pageNumber===1)) && updateList(newUser);
          setTotal(res.data.totalCount);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, [params, newUser]);

  useEffect(() => {
    axiosInstance
      .get(`/roles`)
      .then((res) => {
        if (res.data.success) {
          const newOptions = [
            { value: "", label: "All" },
            ...res.data.data.map((role) => ({
              value: role.name,
              label: role.name,
            })),
          ];
          setRoles(newOptions);
          setTotal(res.data.totalCount);
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
      title: (
        <span className="flex items-center justify-between">
          Staff Code{" "}
          {params.sortBy === "StaffCode" ? (
            params.sortDirection === "asc" ? (
              <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
            ) : (
              <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
            )
          ) : (
            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
          )}
        </span>
      ),
      dataIndex: "staffCode",
      key: "staffcode",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("StaffCode");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Full Name{" "}
          {params.sortBy === "" && nameType === "FullName" ? (
            params.sortDirection === "asc" ? (
              <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
            ) : (
              <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
            )
          ) : (
            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
          )}
        </span>
      ),
      dataIndex: "fullName",
      key: "name",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("");
          setNameType("FullName");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Username{" "}
          {params.sortBy === "" && nameType === "UserName" ? (
            params.sortDirection === "asc" ? (
              <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
            ) : (
              <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
            )
          ) : (
            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
          )}
        </span>
      ),
      dataIndex: "username",
      key: "username",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("");
          setNameType("UserName");
        },
      }),
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Joined Date{" "}
          {params.sortBy === "JoinedDate" ? (
            params.sortDirection === "asc" ? (
              <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
            ) : (
              <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
            )
          ) : (
            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
          )}
        </span>
      ),
      dataIndex: "dateJoined",
      key: "dateJoined",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("JoinedDate");
        },
      }),
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Type{" "}
          {params.sortBy === "Role" ? (
            params.sortDirection === "asc" ? (
              <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
            ) : (
              <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
            )
          ) : (
            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
          )}
        </span>
      ),
      key: "roleName",
      dataIndex: "roleName",
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Role");
        },
      }),
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: () => (
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
              defaultValue={"Type"}
              suffixIcon={<FilterOutlined onClick={() => setOpen(!open)} />}
              className="w-[100px]"
              onChange={(value) =>
                setParams((prev) => ({ ...prev, role: value }))
              }
              onSelect={() => setOpen(!open)}
              options={roles}
            />
          </Space.Compact>
          <div className="flex gap-10">
            <Space.Compact>
              <Search
                className="w-[100%]"
                value={searchQuery}
                allowClear
                maxLength={100}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={() => {
                  setSearchQuery(searchQuery.trim());
                  handleSearch(searchQuery);
                }}
              />
            </Space.Compact>
            <Button
              className="flex items-center h-[32px] bg-d6001c"
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
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No Search Result"
                />
              ),
            }}
            pagination={false}
            className="mt-10"
            columns={columns}
            dataSource={data}
            defaultPageSize={15}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  setModalData(record);
                  setIsModalVisible(true);
                },
              };
            }}
          />
          <div className="w-full flex justify-end">
            <Pagination
              className="text-center text-d6001c"
              defaultCurrent={params.pageNumber}
              defaultPageSize={15}
              total={total}
              onChange={(page) =>
                setParams((prev) => ({ ...prev, pageNumber: page }))
              }
              itemRender={itemRender}
            />
          </div>
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
              <span className="font-bold w-[150px]">Date of Birth:</span>
              <span>{modalData?.dateOfBirth}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Gender:</span>
              {modalData?.Gender === 1 ? (
                <span>Female</span>
              ) : (
                <span>Male</span>
              )}
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
