import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Select,
  message,
  Empty,
} from "antd";
import CustomPagination from "../components/CustomPagination";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
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
  const [roleHolder, setRoleHolder] = useState("Type");
  const [newUser, setNewUser] = useState("new");
  const [params, setParams] = useState({
    location: "cde5153d-3e0d-4d8c-9984-dfe6a9b8c2b1",
    searchTerm: searchQuery,
    role: "",
    sortBy: "StaffCode",
    sortDirection: "asc",
    pageNumber: 1,
    pageSize: 15,
  });

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
    setParams((prev) => ({ ...prev, pageNumber: 1 }));

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
          if (params.pageNumber === 1) {
            setData(
              Array.from(
                new Set(
                  [newUser, ...res.data.data]
                    .map((user) => ({
                      ...user,
                      fullName: `${user?.firstName} ${user?.lastName}`,
                    }))
                    ?.filter((user) => user.firstName !== undefined)
                    .map((user) => JSON.stringify(user))
                )
              )
                .map((user) => JSON.parse(user))
                ?.slice(0, 15)
            );
          } else {
            setData(
              res.data.data.map((user) => ({
                ...user,
                fullName: `${user.firstName} ${user.lastName}`,
              }))
            );
          }
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

  useEffect(() => {
    const isFirstTime = sessionStorage.getItem("isFirstTime") === null;
    if (isFirstTime) {
      if (location?.state?.data) {
        setNewUser(location.state.data);
      }
      sessionStorage.setItem("isFirstTime", "false");
    } else {
      setNewUser(null);
    }

    return () => {
      sessionStorage.removeItem("isFirstTime");
    };
  }, [location]);
  console.log(newUser);

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
          sorterLog("default");
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
          sorterLog("default");
          setNameType("UserName");
        },
      }),
      render: (text) => <span>{text}</span>,
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
      render: (text) => <span>{text}</span>,
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
      render: (text) => <span>{text}</span>,
    },
    {
      title: "",
      key: "action",
      width: "10%",
      render: () => (
        <Space size="middle">
          <Button
            className="bg-tranparent border-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalVisible(false);
              navigate("edit-user");
            }}
          >
            <EditFilled className="text-lg mb-1" />
          </Button>
          <Button
            className="bg-tranparent border-none"
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

  console.log(data);
  console.log(newUser);
  return (
    <LayoutPage>
      <div className="w-full mt-10">
        <h1 className="font-bold text-d6001c text-2xl">User List</h1>
        <div className="flex items-center justify-between mt-7 mb-2">
          <Space.Compact>
            <Select
              open={open}
              value={roleHolder}
              suffixIcon={<FilterOutlined onClick={() => setOpen(!open)} />}
              className="w-[100px]"
              onChange={(value) => {
                setRoleHolder(value);
                setParams((prev) => ({ ...prev, role: value }));
              }}
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
                  setRoleHolder("Type");
                  setParams((prev) => ({ ...prev, role: "" }));
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

        <div className="justify-center items-center mt-0">
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
            <CustomPagination
              params={params}
              setParams={setParams}
              total={total}
            />
          </div>
        </div>
        <Modal
          title={
            <h3 className="w-full border-b-2 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
              Detailed User Information
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
