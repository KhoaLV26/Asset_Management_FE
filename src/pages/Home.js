import { useContext, useState, useEffect } from "react";
import LayoutPage from "../layout/LayoutPage";
import { AuthContext } from "../contexts/AuthContext";
import axiosInstance from "../axios/axiosInstance";
import {
  CheckOutlined,
  CloseOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, Modal, message, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../components/CustomPagination";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/Home.css";

const formatDateTime = (input) => {
  let date = new Date(input);
  let datePart = date.toISOString().split("T")[0];
  let timePart = date.toISOString().split("T")[1].split(".")[0];
  let formattedDateTime = datePart + " " + timePart;
  return formattedDateTime;
};

const stateConvert = (id) => {
  let stateName = "";
  switch (id) {
    case 1:
      stateName = "Accepted";
      break;
    case 2:
      stateName = "Waiting for acceptance";
      break;
    default:
      stateName = "Declined";
      break;
  }
  return stateName;
};

const Home = () => {
  const { auth } = useContext(AuthContext);
  const role = auth?.user?.roleName;
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userResponse, setUserResponse] = useState(false);
  const [changedState, setChangedState] = useState(1);
  const [params, setParams] = useState({
    pageNumber: 1,
    sortBy: "AssignedDate",
    sortOrder: "desc",
  });
  const [currentAssignment, setCurrentAssignment] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);
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
  const handleAssignment = (record, state) => {
    setLoading(true);
    const accepted = state === 3 ? "fasle" : "true";
    axiosInstance
      .put(`/assignments/response/${record?.id}?accepted=${accepted}`)
      .then((response) => {
        if (response.data.success === true) {
          message.success("Response to assignment successfully!");
          if (state === 3) {
            axiosInstance.put(`/assets/response/${record?.assetId}`);
          }
          setUserResponse(false);
          setParams((prev) => ({ ...prev, pageNumber: 1 }));
        } else {
          setUserResponse(false);
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setUserResponse(false);
          message.error(error.response.data.message);
        } else {
          setUserResponse(false);
          message.error(error.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleClicked = (data) => {
    setIsModalOpen(true);
    setSelectedAssignment(data);
  };

  const columns = [
    {
      title: (
        <span className="flex items-center justify-between">
          Asset Code{" "}
          {params.sortBy === "AssetCode" ? (
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
      dataIndex: "assetCode",
      key: "name",
      ellipsis: true,
      width: "10%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("AssetCode");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Asset Name{" "}
          {params.sortBy === "AssetName" ? (
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
      dataIndex: "assetName",
      key: "name",
      ellipsis: true,
      width: "20%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("AssetName");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Assigned By{" "}
          {params.sortBy === "AssignedBy" ? (
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
      key: "assignedBy",
      dataIndex: "by",
      ellipsis: true,
      width: "15%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("AssignedBy");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Assigned Date{" "}
          {params.sortBy === "AssignedDate" ? (
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
      key: "assignedDate",
      dataIndex: "assignedDate",
      ellipsis: true,
      width: "15%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("AssignedDate");
        },
      }),
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          State{" "}
          {params.sortBy === "State" ? (
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
      key: "state",
      dataIndex: "state",
      ellipsis: true,
      width: "25%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("State");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="middle"
            disabled={record?.state === "Accepted"}
            onClick={(e) => {
              e.stopPropagation();
              setChangedState(1);
              setCurrentAssignment(record);
              setUserResponse(true);
            }}
          >
            <CheckOutlined className="text-red-600 text-sm mb-1" />
          </Button>
          <Button
            size="middle"
            disabled={record?.state === "Accepted"}
            onClick={(e) => {
              e.stopPropagation();
              setChangedState(3);
              setCurrentAssignment(record);
              setUserResponse(true);
            }}
          >
            <CloseOutlined className="text-sm mb-1" />
          </Button>
          <Button
            size="middle"
            disabled={record?.state === "Waiting for acceptance"}
            onClick={(e) => {
              e.stopPropagation();
              navigate("manage-assignment/return-assignment");
            }}
          >
            <RedoOutlined className="text-blue-600 text-sm mb-1" />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/Assignments/user", { params })
      .then((res) => {
        if (res.data.success) {
          setTotal(res.data.totalCount);
          setData(
            res.data.data.map((asset, index) => ({
              key: index,
              ...asset,
              state: stateConvert(asset.status),
            }))
          );
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 409) {
          setData([]);
          setTotal(0);
        } else message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  return (
    <LayoutPage>
      {role ? (
        <div className="w-full mt-10">
          <h1 className="font-bold text-d6001c text-2xl">My Assignment</h1>
          <Spin spinning={loading}>
            <div className="justify-center items-center mt-[70px] h-[780px]">
              <Table
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="You don't have any Assignment"
                    />
                  ),
                }}
                pagination={false}
                className="usertable mt-10 h-[730px]"
                columns={columns}
                dataSource={data}
                defaultPageSize={10}
                onRow={(record) => {
                  return {
                    onDoubleClick: () => {
                      record.state === "Accepted" && handleClicked(record);
                    },
                  };
                }}
                rowKey="key"
                rowClassName={(record) =>
                  ` ant-table-row row-${record.state.replace(/ /g, "")}`
                }
              />

              <div className="w-full flex justify-end">
                <CustomPagination
                  params={params}
                  setParams={setParams}
                  total={total}
                />
              </div>

              <Modal
                title={
                  <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
                    Detailed Assignment Information
                  </h3>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                className="custom-modal mt-[10%]"
              >
                <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Asset Code:</span>
                    <span className="max-w-[290px]">{selectedAssignment?.assetCode}</span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Asset Name:</span>
                    <span className="max-w-[290px]">{selectedAssignment?.assetName}</span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Specification:</span>
                    <span className="max-w-[290px]">{selectedAssignment?.specification}</span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Assigned By: </span>
                    <span className="max-w-[290px]">{selectedAssignment?.by}</span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Assigned Date:</span>
                    <span className="max-w-[290px]">
                      {selectedAssignment &&
                        formatDateTime(selectedAssignment?.assignedDate)}
                    </span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">State:</span>
                    <span className="max-w-[290px]">{stateConvert(selectedAssignment?.status)}</span>
                  </div>          
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Note: </span>
                    <span className="max-w-[290px]">{selectedAssignment?.note}</span>
                  </div>
                </div>
              </Modal>
              <ConfirmModal
                title={"Are you sure?"}
                text={
                  changedState === 1
                    ? "Do you want to accept this assignment?"
                    : "Do you want to decline this assignment?"
                }
                textconfirm={changedState === 1 ? "Accept" : "Decline"}
                textcancel={"Cancel"}
                onConfirm={() =>
                  handleAssignment(currentAssignment, changedState)
                }
                onCancel={() => setUserResponse(false)}
                isShowModal={userResponse}
                setisShowModal={setUserResponse}
              />
            </div>
          </Spin>
        </div>
      ) : (
        <div className="mx-auto py-[9rem] text-center">
          <h1 className="text-[#d6001c] font-bold text-4xl">
            Online Asset Management
          </h1>
          <span className="text-[#d6001c] font-bold text-2xl">
            Please login to continue !
          </span>
        </div>
      )}
    </LayoutPage>
  );
};

export default Home;
