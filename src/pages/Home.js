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
import { ConfirmModal, CustomPagination } from "../components";
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
      stateName = "Waiting for returning";
      break;
  }
  return stateName;
};

export const Home = () => {
  const { auth } = useContext(AuthContext);
  const role = auth?.user?.roleName;
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userResponse, setUserResponse] = useState(false);
  const [createRequestModal, setCreateRequestModal] = useState(false);
  const [changedState, setChangedState] = useState(1);
  const [reload, setReload] = useState(false);
  const [params, setParams] = useState({
    pageSize: 10,
    pageNumber: 1,
    sortBy: "AssignedDate",
    sortOrder: "desc",
  });
  const [currentAssignment, setCurrentAssignment] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [idSelected, setIdSelected] = useState(null);
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

  const openCreateReturningRequest = (id) => {
    setCreateRequestModal(true);
    setIdSelected(id);
  };

  const createReturningRequest = () => {
    axiosInstance
      .post(`/request-for-returning?assignmentId=${idSelected}`)
      .then((res) => {
        if (res.data.success) {
          setReload(!reload);
          setParams((prev) => ({ ...prev, pageNumber: 1 }));
          setCreateRequestModal(false);
          message.success(
            "Create returning request for this asset successfully"
          );
        } else {
          message.error("Create returning request for this asset failed");
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
          if (state === 1) {
            setParams((prev) => ({ ...prev, newAssignmentId: record.id }));
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
      title: <span className="flex items-center justify-between">No</span>,
      dataIndex: "index",
      width: "6%",
      key: "index",
      render: (text, record, index) => (
        <span>{index + 1 + (params?.pageNumber - 1) * params.pageSize}</span>
      ),
    },
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
      dataIndex: "assignedByName",
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
            className="bg-tranparent border-none"
            size="middle"
            disabled={
              record?.state === "Accepted" ||
              record?.state === "Waiting for returning"
            }
            onClick={(e) => {
              e.stopPropagation();
              setChangedState(1);
              setCurrentAssignment(record);
              setUserResponse(true);
            }}
          >
            <CheckOutlined className="text-red-600 text-sm mb-1 check-icon"/>
          </Button>
          <Button
            className="bg-tranparent border-none"
            size="middle"
            disabled={
              record?.state === "Accepted" ||
              record?.state === "Waiting for returning"
            }
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
            className="bg-tranparent border-none"
            size="middle"
            disabled={
              record?.state === "Waiting for acceptance" ||
              record?.returnRequests != null
            }
            onClick={(e) => {
              e.stopPropagation();
              openCreateReturningRequest(record?.id);
            }}
          >
            <RedoOutlined className="text-blue-600 text-sm mb-1" />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    role && setLoading(true);
    role && axiosInstance
      .get("/Assignments/user", { params })
      .then((res) => {
        if (res.data.success) {
          setTotal(res.data.totalCount);
          setData(
            res.data.data.map((asset, index) => {
              if (asset.returnRequests !== null) {
                asset.status = 0;
              }

              return {
                key: index,
                ...asset,
                state: stateConvert(asset.status),
              };
            })
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
  }, [params, reload]);

  return (
    <LayoutPage>
      {role ? (
        <div className="w-full mt-10">
          <h1 className="font-bold text-d6001c text-2xl">My Assignment</h1>
          <Spin spinning={loading}>
            <div className="justify-center items-center mt-[70px] h-[780px] w-full">
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
                scroll={{ y: 650 }}
                className="usertable mt-10 h-[730px]"
                columns={columns}
                dataSource={data}
                defaultPageSize={10}
                onRow={(record) => {
                  return {
                    onDoubleClick: () => {
                      record.state !== "Waiting for acceptance" &&
                        handleClicked(record);
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
                    <span className="max-w-[290px]">
                      {selectedAssignment?.assetCode}
                    </span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Asset Name:</span>
                    <span className="max-w-[290px]">
                      {selectedAssignment?.assetName}
                    </span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Specification:</span>
                    <span className="max-w-[290px]">
                      {selectedAssignment?.specification}
                    </span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Assigned By: </span>
                    <span className="max-w-[290px]">
                      {selectedAssignment?.assignedByName}
                    </span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Assigned Date:</span>
                    <span className="max-w-[290px]">
                      {selectedAssignment &&
                        formatDateTime(selectedAssignment?.assignedDate)}
                    </span>
                  </div>
                  <div className="flex mb-[10px]">
                    <span className="font-bold w-[150px]">Note: </span>
                    <span className="max-w-[290px]">
                      {selectedAssignment?.note}
                    </span>
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
                textConfirm={changedState === 1 ? "Accept" : "Decline"}
                textCancel={"Cancel"}
                onConfirm={() =>
                  handleAssignment(currentAssignment, changedState)
                }
                onCancel={() => setUserResponse(false)}
                isShowModal={userResponse}
                setisShowModal={setUserResponse}
              />
              <ConfirmModal
                title={"Are you sure?"}
                text={
                  "Do you want to create a returning request for this asset?"
                }
                textConfirm={"Yes"}
                textCancel={"No"}
                onConfirm={() => createReturningRequest()}
                onCancel={() => setCreateRequestModal(false)}
                isShowModal={createRequestModal}
                setisShowModal={setCreateRequestModal}
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
