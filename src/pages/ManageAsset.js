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
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import "../styles/ManageAsset.css";
import { ConfirmModal, CustomPagination } from "../components";

const { Search } = Input;

const stateConvert = (id) => {
  let stateName = "";
  switch (id) {
    case 1:
      stateName = "Not available";
      break;
    case 2:
      stateName = "Available";
      break;
    case 3:
      stateName = "Assigned";
      break;
    case 4:
      stateName = "Waiting for recycling";
      break;
    default:
      stateName = "Recycled";
      break;
  }
  return stateName;
};

const AssignmentTable = ({ selectedAsset }) => {
  const columns = [
    {
      title: "Time",
      dataIndex: "assignedDate",
      key: "assignedDate",
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: "Assigned By",
      dataIndex: "assignedByName",
      key: "assignedByName",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
    },
  ];

  const data =
    selectedAsset?.assignmentResponses?.map((item, index) => ({
      key: index,
      assignedDate: item.assignedDate,
      assignedByName: item.assignedByName,
      assignedToName: item.assignedToName,
    })) || [];

  return (
    <Table
      scroll={{ y: 100 }}
      locale={{
        emptyText: "No Data",
      }}
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
};

export const ManageAsset = () => {
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const [toEdit, setToEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, pageNumber: 1, search: value }));
  };
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleClicked = (data) => {
    setIsModalOpen(true);
    setSelectedAsset({id : data.id});
  };
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [currentId, setCurrentId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [params, setParams] = useState({ pageNumber: 1, sortOrder: "asc" });
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
      title: "Id",
      dataIndex: "id",
      key: "id",
      hidden: true,
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
      width: "15%",
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
      width: "30%",
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
          Category{" "}
          {params.sortBy === "Category" ? (
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
      dataIndex: "categoryName",
      key: "category",
      width: "20%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Category");
        },
      }),
      render: (text) => <span>{text}</span>,
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
      width: "18%",
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
      width: "12%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="bg-tranparent border-none"
            disabled={record?.state === "Assigned"}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`edit-asset/${record.id}`);
            }}
          >
            <EditFilled className="text-lg mb-1" />
          </Button>
          <Button
            className="bg-tranparent border-none"
            disabled={record?.state === "Assigned"}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAsset(record);
              setCurrentId(record?.id);
              setIsDelete(true);
            }}
          >
            <CloseCircleOutlined className="text-red-600 text-lg mb-1 check-icon" />
          </Button>
        </Space>
      ),
    },
  ];

  console.log(params);
  const handleCancel = () => {
    setIsModalOpen(false);
    setToEdit(false);
  };

  const handleDelete = (currentId) => {
    setShowConfirm(false);
    axiosInstance
      .delete(`/assets/${currentId}`)
      .then((res) => {
        if (res.data.success) {
          message.success("Asset deleted");
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
  useEffect(() => {
    const isFirstTimeAsset =
      sessionStorage.getItem("isFirstTimeAsset") === null;
    if (isFirstTimeAsset) {
      if (location?.state?.data) {
        setParams((prev) => ({
          ...prev,
          newAssetCode: location.state.data.assetCode,
        }));
      }
      sessionStorage.setItem("isFirstTimeAsset", "false");
    } else {
      setParams((prev) => ({ ...prev, newAssetCode: "" }));
    }

    return () => {
      sessionStorage.removeItem("isFirstTimeAsset");
    };
  }, [location]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/Assets", { params })
      .then((res) => {
        if (res.data.success) {
          setTotal(res.data.totalCount);
          setData(
            res.data.data.map((asset) => ({
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    axiosInstance
      .get("/Categories")
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    if (isModalOpen || currentId) {
      setLoading(true);
      axiosInstance
        .get(`/Assets/${selectedAsset?.id}`)
        .then((res) => {
          if (res.data.success) {
            setSelectedAsset(res.data.data);
            currentId && setIsDelete(true);
            setCurrentId(null);
          } else {
            message.error(res.data.message);
            setCurrentId(null);
          }
        })
        .catch((err) => {
          message.error(err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isModalOpen, currentId]);

  useEffect(() => {
    isDelete &&
      selectedAsset === null &&
      message.error("Asset no longer exist")
    isDelete &&
      selectedAsset?.assignmentResponses?.length > 0 &&
      setToEdit(true);
    isDelete &&
      selectedAsset?.assignmentResponses?.length === 0 &&
      setShowConfirm(true);
    setIsDelete(false);
  }, [isDelete]);

  return (
    <LayoutPage>
      <div className="w-full mt-10">
        <h1 className="font-bold text-d6001c text-2xl">Asset List</h1>
        <div className="flex items-center justify-between mt-7 mb-2">
          <Space.Compact>
            <Select
              open={openStateDropdown}
              defaultValue={"State"}
              suffixIcon={
                <FilterOutlined
                  style={{ fontSize: "16px" }}
                  onClick={() => setOpenStateDropdown((prev) => !prev)}
                />
              }
              className="custom-select w-[250px]"
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
                  label: "Not available",
                },
                {
                  value: "2",
                  label: "Available",
                },
                {
                  value: "3",
                  label: "Assigned",
                },
                {
                  value: "4",
                  label: "Waiting for recycling",
                },
                {
                  value: "5",
                  label: "Recycled",
                },
              ]}
            />
          </Space.Compact>
          <Space.Compact>
            <Select
              open={openCategoryDropdown}
              defaultValue={"Category"}
              suffixIcon={
                <FilterOutlined
                  style={{ fontSize: "16px" }}
                  onClick={() => setOpenCategoryDropdown((prev) => !prev)}
                />
              }
              className="custom-select w-[250px]"
              onChange={(value) =>
                setParams((prev) => ({
                  ...prev,
                  pageNumber: 1,
                  category: value,
                }))
              }
              onDropdownVisibleChange={(isOpen) =>
                setOpenCategoryDropdown(isOpen)
              }
              options={[
                { value: "", label: "All" },
                ...categories.map((c) => {
                  return { value: c.id, label: c.name };
                }),
              ]}
            />
          </Space.Compact>
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
                navigate("create-asset");
              }}
            >
              Create new asset
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
                    ascription="No Search Result"
                  />
                ),
              }}
              scroll={{ y: 650 }}
              pagination={false}
              className="mt-10 h-[730px] max-w-full "
              //style={{maxWidth: "90%"}}
              columns={columns}
              dataSource={data}
              defaultPageSize={15}
              onRow={(record) => {
                return {
                  onDoubleClick: () => {
                    handleClicked(record);
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
            <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
              Detailed Asset Information
            </h3>
          }
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          className="custom-modal m-auto"
        >
          <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Asset Code:</span>
              <span className="max-w-[290px]">{selectedAsset?.assetCode}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Asset Name:</span>
              <span className="max-w-[290px]">{selectedAsset?.assetName}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Category:</span>
              <span>{selectedAsset?.categoryName}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Install Date:</span>
              <span>{selectedAsset?.installDate}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Specification:</span>
              <span className="max-w-[290px]">
                {selectedAsset?.specification}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">State:</span>
              <span className="max-w-[290px]">
                {stateConvert(selectedAsset?.status)}
              </span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">History Assignment:</span>
            </div>
            <div className="mb-[10px]">
              <AssignmentTable selectedAsset={selectedAsset} />
            </div>
          </div>
        </Modal>
        <Modal
          title={
            <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
              Cannot Delete Asset
            </h3>
          }
          open={toEdit}
          onCancel={handleCancel}
          footer={null}
          className="custom-modal mt-[10%]"
        >
          <div className="px-[40px] py-[20px] pt-[15px] pb-[15px] text-[15px]">
            <h1 className="text-[17px]">
              Cannot delete the asset because it belongs to one or more
              historical assignments.
            </h1>
            <h1 className="text-[17px]">
              If the asset is not able to be used anymore, please update its
              state in{" "}
              <Link
                to={`edit-asset/${selectedAsset?.id}`}
                className="text-blue-400 underline"
              >
                Edit Asset page
              </Link>
            </h1>
          </div>
        </Modal>
        <ConfirmModal
          title={"Are you sure?"}
          text={"Do you want to delete this asset?"}
          textConfirm={"Delete"}
          textCancel={"Cancel"}
          onConfirm={() => handleDelete(selectedAsset.id)}
          onCancel={() => {
            setShowConfirm(false);
            setCurrentId(null);
          }}
          isShowModal={showConfirm}
          setisShowModal={setShowConfirm}
        />
      </div>
    </LayoutPage>
  );
};

export default ManageAsset;
