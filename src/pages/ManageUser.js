import React, { useState, useEffect, useContext } from "react";
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
  Spin,
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
import ConfirmModal from "../components/ConfirmModal";
import { AuthContext } from "../contexts/AuthContext";

const { Search } = Input;

const ManageUser = () => {
  const [data, setData] = useState([]);
  const [userAssignments, setUserAssignments] = useState({});
  const [isDelete, setIsDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [toEdit, setToEdit] = useState(false);
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState(true);
  const [modalData, setModalData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [roleHolder, setRoleHolder] = useState("Type");
  const [params, setParams] = useState({
    search: searchQuery,
    role: "",
    sortBy: "StaffCode",
    sortOrder: "asc",
    pageNumber: 1,
    newStaffCode: location?.state?.data?.staffCode || 0,
  });
  const { auth } = useContext(AuthContext);

  const adminId = auth?.user?.id;

  const handleDelete = (currentId) => {
    setShowConfirm(false);
    axiosInstance
      .delete(`/users/${currentId}`)
      .then((res) => {
        if (res.data.success) {
          message.success("User Disabled");
          setParams((prev) => ({ ...prev, pageNumber: 1 }));
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          setToEdit(true);
        } else message.error(err.response.data.message);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setToEdit(false);
  };

  const sorterLog = (name) => {
    if (params.sortBy === name) {
      if (direction === true) {
        setParams((prev) => ({ ...prev, sortOrder: "desc" }));
      } else {
        setParams((prev) => ({ ...prev, sortOrder: "asc" }));
      }
      setDirection(!direction);
    } else {
      setParams((prev) => ({ ...prev, sortBy: name }));
      setDirection(true);
      setParams((prev) => ({ ...prev, sortOrder: "asc" }));
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
      search: removeExtraWhitespace(value),
    }));
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/Users", { params })
      .then((res) => {
        if (res.data.success) {
          setData(
            res.data.data.map((user) => ({
              ...user,
              fullName: `${user.firstName} ${user.lastName}`,
            }))
          );
          setTotal(res.data.totalCount);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

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
        setParams((prev) => ({
          ...prev,
          newStaffCode: location.state.data.staffCode,
        }));
      }
      sessionStorage.setItem("isFirstTime", "false");
    } else {
      setParams((prev) => ({ ...prev, newStaffCode: "" }));
    }

    return () => {
      sessionStorage.removeItem("isFirstTime");
    };
  }, [location]);

  const columns = [
    {
      title: <span className="flex items-center justify-between">No</span>,
      dataIndex: "index",
      width: "6%",
      key: "index",
      render: (text, record, index) => (
        <span>{index + 1 + (params?.pageNumber - 1) * 10}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Staff Code{" "}
          {params.sortBy === "StaffCode" ? (
            params.sortOrder === "asc" ? (
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
      ellipsis: true,
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
          {params.sortBy === "default" ? (
            params.sortOrder === "asc" ? (
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
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("default");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Username{" "}
          {params.sortBy === "Username" ? (
            params.sortOrder === "asc" ? (
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
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Username");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Joined Date{" "}
          {params.sortBy === "JoinedDate" ? (
            params.sortOrder === "asc" ? (
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
      ellipsis: true,
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
            params.sortOrder === "asc" ? (
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
      ellipsis: true,
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
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="bg-tranparent border-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalVisible(false);
              navigate(`edit-user/${record.id}`);
            }}
          >
            <EditFilled className="text-lg mb-1" />
          </Button>
          <Button
            disabled={record.id === adminId}
            className="bg-tranparent border-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalVisible(false);
              setSelectedUser(record);
              setCurrentId(record.id);
              // setShowConfirm((prevShowConfirm) => {
              //   return true;
              // });
            }}
          >
            <CloseCircleOutlined className="text-red-600 text-lg mb-1" />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (currentId) {
      axiosInstance
        .get(`/Assignments/User/${selectedUser?.id}`)
        .then((res) => {
          if (res.data.success) {
            setUserAssignments(res.data.data);
            currentId && setIsDelete(true);
            setCurrentId(null);
          } else {
            message.error(res.data.message);
            setCurrentId(null);
          }
        })
        .catch((err) => {
          if (err.response?.status === 409) {
            setUserAssignments([]);
            currentId && setIsDelete(true);
            setCurrentId(null);
          } else message.error(err.response.data.message);
        });
    }
  }, [currentId]);

  useEffect(() => {
    isDelete && userAssignments?.length > 0 && setToEdit(true);
    isDelete && userAssignments?.length === 0 && setShowConfirm(true);
    setIsDelete(false);
  }, [isDelete]);

  return (
    <LayoutPage>
      <div className="w-full mt-10">
        <h1 className="font-bold text-d6001c text-2xl">User List</h1>
        <div className="flex items-center justify-between mt-7 mb-2">
          <Space.Compact>
            <Select
              open={open}
              value={roleHolder}
              suffixIcon={
                <FilterOutlined onClick={() => setOpen((prev) => !prev)} />
              }
              className="w-[100px]"
              onChange={(value) => {
                setRoleHolder(value);
                setParams((prev) => ({ ...prev, role: value }));
              }}
              onDropdownVisibleChange={(isOpen) => setOpen(isOpen)}
              options={roles}
            />
          </Space.Compact>
          <div className="flex gap-10">
            <Space.Compact>
              <Search
                className="w-[100%]"
                value={searchQuery}
                allowClear
                placeholder="Enter text"
                maxLength={100}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={(value, event, input) => {
                  if (input.source !== "clear") {
                    setSearchQuery(searchQuery.trim());
                    handleSearch(searchQuery);
                    setRoleHolder("Type");
                    setParams((prev) => ({ ...prev, role: "" }));
                  }
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
        <Spin spinning={loading}>
          <div className="justify-center items-center mt-0 h-[780px]">
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
              className="mt-10 h-[730px]"
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
        </Spin>
        <Modal
          title={
            <h3 className="w-full border-b-2 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
              Detailed User Information
            </h3>
          }
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          className="custom-modal mt-[10%]"
        >
          <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Staff Code:</span>
              <span className="w-full max-w-[290px]">
                {modalData?.staffCode}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Full Name:</span>
              <span className="w-full max-w-[290px]">
                {modalData?.fullName}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Username:</span>
              <span className="w-full max-w-[290px]">
                {modalData?.username}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Date of Birth:</span>
              <span className="w-full max-w-[290px]">
                {modalData?.dateOfBirth}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Gender:</span>
              {modalData?.Gender === 1 ? (
                <span className="w-full max-w-[290px]">Female</span>
              ) : (
                <span className="w-full max-w-[290px]">Male</span>
              )}
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Type:</span>
              <span className="w-full max-w-[290px]">
                {modalData?.roleName}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Location:</span>
              <span className="w-full max-w-[290px]">
                {modalData?.locationName}
              </span>
            </div>
          </div>
        </Modal>
        <Modal
          title={
            <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
              Cannot Disable User
            </h3>
          }
          open={toEdit}
          onCancel={handleCancel}
          footer={null}
          className="custom-modal mt-[10%]"
        >
          <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
            <h1 className="text-lg">
              There are valid assignments belonging to this user. Please close
              all assignments before disabling user.
            </h1>
          </div>
        </Modal>
        <ConfirmModal
          title={"Are you sure?"}
          text={"Do you want to disable this user?"}
          textconfirm={"Disable"}
          textcancel={"Cancel"}
          onConfirm={() => handleDelete(selectedUser.id)}
          onCancel={() => {
            setShowConfirm(false);
            setCurrentId("");
          }}
          isShowModal={showConfirm}
          setisShowModal={setShowConfirm}
        />
      </div>
    </LayoutPage>
  );
};

export default ManageUser;
