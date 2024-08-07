import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Select,
  message,
  Empty,
  DatePicker,
  Spin,
} from "antd";
import LayoutPage from "../layout/LayoutPage";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import {
  FilterOutlined,
  EditFilled,
  CloseCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import "../styles/ManageAsset.css";
import { ConfirmModal, CustomPagination } from "../components";

const { Search } = Input;

const formatDateTime = (input) => {
  let inputDate = new Date(input)
  let tzoffset = inputDate.getTimezoneOffset() * 60000;
  let date = (new Date(inputDate - tzoffset)).toISOString().slice(0, -1);
  let datePart = date.split("T")[0];
  return datePart;
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
    case 3:
      stateName = "Declined";
      break;
    case 4:
      stateName = "Returned";
      break;
  }
  return stateName;
};

export const ManageAssignment = () => {
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, pageNumber: 1, search: value }));
  };
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  const handleClicked = (data) => {
    setIsModalOpen(true);
    axiosInstance
      .get(`assignments/${data.id}`)
      .then(res => {
        if (res.data.success) {
          setSelectedAssignment(res.data.data);
        }
        else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
    
  };

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [createRequestModal, setCreateRequestModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [params, setParams] = useState({ pageNumber: 1, pageSize: 10 });

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

  const openFormConfirmDelete = (id) => {
    setDeleteModalVisible(true);
    setIdSelected(id);
  };

  const deleteAssignment = () => {
    axiosInstance
      .delete(`/Assignments/${idSelected}`)
      .then((res) => {
        if (res.data.success) {
          setIsDeleteSuccess(!isDeleteSuccess);
          setParams((prev) => ({ ...prev, pageNumber: 1 }));
          setDeleteModalVisible(false);
          message.success("Delete assignment successfully");
        } else {
          message.error("Delete assignment failed");
        }
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };

  const openCreateReturningRequest = (id) => {
    setCreateRequestModal(true);
    setIdSelected(id);
  };

  const createReturningRequest = () => {
    setLoading(true);
    axiosInstance
      .post(`/request-for-returning/${idSelected}`)
      .then((res) => {
        if (res.data.success) {
          setIsDeleteSuccess(!isDeleteSuccess);
          setParams((prev) => ({ ...prev, pageNumber: 1 }));
          setCreateRequestModal(false);
          message.success(
            "Create returning request for this asset successfully"
          );
        } else {
          message.error("Create returning request for this asset failed");
        }
      })
      .catch((err) => {
        message.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: <span className="flex items-center justify-between">No</span>,
      dataIndex: "index",
      width: "5%",
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
      width: "10%",
      ellipsis: true,
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
      width: "15%",
      ellipsis: true,
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
          Assigned To{" "}
          {params.sortBy === "AssignedTo" ? (
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
      dataIndex: "assignedToName",
      key: "assignedTo",
      width: "13%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("AssignedTo");
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
      width: "13%",
      ellipsis: true,
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
      width: "13%",
      ellipsis: true,
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
      width: "15%",
      ellipsis: true,
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
      width: "16%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="bg-tranparent border-none"
            size="middle"
            disabled={
              record?.state === "Accepted" || record?.state === "Declined"
            }
            onClick={(e) => {
              e.stopPropagation();
              navigate(`edit-assignment/${record.id}`);
            }}
          >
            <EditFilled className="text-sm mb-1" />
          </Button>

          <Button
            className="bg-tranparent border-none"
            size="middle"
            disabled={
              record?.state === "Accepted" || record?.state === "Declined"
            }
            onClick={(e) => {
              e.stopPropagation();
              openFormConfirmDelete(record?.id);
            }}
          >
            <CloseCircleOutlined className="text-red-600 text-sm mb-1 check-icon" />
          </Button>
          <Button
            className="bg-tranparent border-none"
            size="middle"
            disabled={
              record?.state === "Waiting for acceptance" ||
              record?.state === "Declined" ||
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
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const isFirstTimeAssignment =
      sessionStorage.getItem("isFirstTimeAssignment") === null;
    if (isFirstTimeAssignment) {
      if (location?.state?.data) {
        setParams((prev) => ({
          ...prev,
          newAssignmentId: location.state.data.id,
        }));
      }
      sessionStorage.setItem("isFirstTimeAssignment", "false");
    }
    return () => {
      sessionStorage.removeItem("isFirstTimeAssignment");
    };
  }, [location, isDeleteSuccess]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/Assignments", { params })
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
        } else message.error(err.response.data.message);
        ;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params, isDeleteSuccess]);

  return (
    <LayoutPage>
      <div className="w-full mt-10">
        <h1 className="font-bold text-d6001c text-2xl">Assignment List</h1>
        <div className="flex items-center justify-between mt-7 mb-2">
          <div className="flex gap-10 w-[30%]">
            <Select
              open={openStateDropdown}
              defaultValue={"State"}
              suffixIcon={
                <FilterOutlined
                  style={{ fontSize: "16px" }}
                  onClick={() => setOpenStateDropdown((prev) => !prev)}
                />
              }
              className="custom-select w-[200px]"
              onChange={(value) =>
                setParams((prev) => ({ ...prev, state: value, pageNumber: 1 }))
              }
              onDropdownVisibleChange={(isOpen) => setOpenStateDropdown(isOpen)}
              options={[
                {
                  value: "All",
                  label: "All",
                },
                {
                  value: "1",
                  label: "Accepted",
                },
                {
                  value: "2",
                  label: "Waiting for acceptance",
                },
                {
                  value: "3",
                  label: "Declined",
                },
              ]}
            />
            <DatePicker
              inputReadOnly
              className="custom-select w-[100%]"
              format="YYYY-MM-DD"
              placeholder="Assigned Date"
              onChange={(value) =>
                setParams((prev) => ({
                  ...prev,
                  pageNumber: 1,
                  assignedDate: value?.format("YYYY-MM-DD"),
                }))
              }
            />
          </div>
          <div className="flex gap-10">
            <Space.Compact>
              <Search
                className="custom-search w-[100%]"
                maxLength={100}
                placeholder="Enter text"
                value={searchQuery}
                allowClear
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={(value, event, input) => {
                  if (input.source !== "clear") {
                    setSearchQuery(searchQuery.trim());
                    handleSearch(removeExtraWhitespace(searchQuery));
                  }
                }}
              />
            </Space.Compact>
            <Button
              className="flex items-center h-[32px] bg-d6001c"
              type="primary"
              size="large"
              onClick={() => {
                navigate("create-assignment");
              }}
            >
              Create new assignment
            </Button>
          </div>
        </div>
        <Spin spinning={loading}>
          <div className="justify-center items-center mt-0 h-[780px] w-full">
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
              scroll={{ y: 650 }}
              className="mt-10 h-[730px]"
              columns={columns}
              dataSource={data}
              defaultPageSize={10}
              onRow={(record) => {
                return {
                  onDoubleClick: () => {
                    handleClicked(record);
                  },
                };
              }}
              rowKey="key"
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
            <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
              Detailed Assignment Information
            </h3>
          }
          open={isModalOpen}
          onCancel={handleCancel}
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
              <span className="font-bold w-[150px]">Assigned To: </span>
              <span className="max-w-[290px]">
                {selectedAssignment?.assignedToName}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Time:</span>
              <span className="max-w-[290px]">
                {selectedAssignment &&
                  formatDateTime(selectedAssignment?.assignedDate)}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">State:</span>
              <span className="max-w-[290px]">
                {stateConvert(selectedAssignment?.status)}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Note: </span>
              <span className="max-w-[290px]">{selectedAssignment?.note}</span>
            </div>
          </div>
        </Modal>
        <ConfirmModal
          title={"Are you sure?"}
          text={"Do you want to delete this assignment?"}
          textConfirm={"Delete"}
          textCancel={"Cancel"}
          onConfirm={() => deleteAssignment()}
          onCancel={() => setDeleteModalVisible(false)}
          isShowModal={isDeleteModalVisible}
          setisShowModal={setDeleteModalVisible}
        />
        <ConfirmModal
          title={"Are you sure?"}
          text={"Do you want to create a returning request for this asset?"}
          textConfirm={"Yes"}
          textCancel={"No"}
          onConfirm={() => createReturningRequest()}
          onCancel={() => setCreateRequestModal(false)}
          isShowModal={createRequestModal}
          setisShowModal={setCreateRequestModal}
        />
      </div>
    </LayoutPage>
  );
};

export default ManageAssignment;
