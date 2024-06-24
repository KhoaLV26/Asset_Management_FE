import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table, Modal, Select, message, Empty } from "antd";
import LayoutPage from "../layout/LayoutPage";
import { removeExtraWhitespace } from "../HandleString";
import {
  FilterOutlined,
  EditFilled,
  CloseCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import "../styles/ManageAsset.css";
import CustomPagination from "../components/CustomPagination";
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
  return stateName
};

const ManageAsset = () => {
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
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
    setSelectedAsset(data);
  };
  const [selectedAsset, setSelectedAsset] = useState(null);

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
      width: "18%",
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
      width: "18%",
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
      width: "18%",
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
      width: "10%",
      
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={record?.state === "Assigned"}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`edit-asset/${record.id}`);
            }}
          >
            <EditFilled className="text-lg mb-1" />
          </Button>
          <Button
            disabled={record?.state === "Assigned"}
            onClick={(e) => {
              e.stopPropagation();
              navigate("delete-asset");
            }}
          >
            <CloseCircleOutlined className="text-red-600 text-lg mb-1" />
          </Button>
        </Space>
      ),
    },
  ];
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const isFirstTimeAsset = sessionStorage.getItem("isFirstTimeAsset") === null;
    if (isFirstTimeAsset) {
      if (location?.state?.data) {
        setParams((prev) => ({ ...prev, newAssetCode: location.state.data.assetCode }));
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
    axiosInstance
      .get("/Assets", { params })
      .then((res) => {
        if (res.data.success) {
          setTotal(res.data.totalCount);
          setData(res.data.data.map(asset => ({
            ...asset,
            state: stateConvert(asset.status),
          })))
        }
      }
      )
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 409) {
          setData([])
          setTotal(0)
        } else message.error(err.message);
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
        message.error(err.message);
      });
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      axiosInstance
        .get(`/Assets/${selectedAsset.id}`)
        .then((res) => {
          if (res.data.success) {
            setSelectedAsset(res.data.data);
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  }, [isModalOpen]);

  return (
    <LayoutPage>
      <div className="w-full mt-10">
        <h1 className="font-bold text-d6001c text-2xl">Asset List</h1>
        <div className="flex items-center justify-between mt-7 mb-2">
          <Space.Compact>
            <Select
              open={openStateDropdown}
              defaultValue={"State"}
              suffixIcon={<FilterOutlined style={{ fontSize: "16px" }} onClick={() => setOpenStateDropdown((prev) => !prev)} />}
              className="w-[250px]"
              onChange={(value) =>
                setParams((prev) => ({ ...prev, state: value, pageNumber: 1 }))
              }
              onDropdownVisibleChange={(isOpen => setOpenStateDropdown(isOpen))}
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
                }
              ]}
            />
          </Space.Compact>
          <Space.Compact>
            <Select
              open={openCategoryDropdown}
              defaultValue={"Category"}
              suffixIcon={<FilterOutlined style={{ fontSize: "16px" }} onClick={() => setOpenCategoryDropdown((prev) => !prev)} />}
              className="w-[250px]"
              onChange={(value) =>
                setParams((prev) => ({ ...prev, pageNumber: 1, category: value }))
              }
              onDropdownVisibleChange={(isOpen => setOpenCategoryDropdown(isOpen))}
              options={[{ value: "", label: "All" }, ...categories.map(c => { return { value: c.id, label: c.name } })]}
            />
          </Space.Compact>
          <div className="flex gap-10">
            <Space.Compact>
              <Search
                className="w-[100%]"
                maxLength={100}
                placeholder="Enter text"
                value={searchQuery}
                allowClear
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={() => {
                  setSearchQuery(searchQuery.trim());
                  handleSearch(removeExtraWhitespace(searchQuery));
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
        <div className="justify-center items-center mt-0 h-[780px]">
          {console.log(data)}
          <Table
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  ascription="No Search Result"
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
        {console.log(selectedAsset)}
        <Modal
          title={
            <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
              Detailed Asset Information
            </h3>
          }
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          className="custom-modal"
        >
          <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Asset Code:</span>
              <span>{selectedAsset?.assetCode}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">Asset Name:</span>
              <span>{selectedAsset?.assetName}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">State:</span>
              <span>{stateConvert(selectedAsset?.status)}</span>
            </div>
            <div className="flex mb-[10px]">
              <span className="font-bold w-[150px]">History Assignment:</span>
            </div>
            <div className="mb-[10px]">
              {selectedAsset?.assignmentResponses?.map((item) => (
                <div>
                  <span> Time: {item.assignedDate.slice(0, 10)} </span>
                  <span> | </span>
                  <span> Assigned By: {item.by}</span>
                  <span> Assigned To: {item.to}</span>
                </div>
              )
              )}
            </div>
          </div>
        </Modal>
      </div>
    </LayoutPage>
  );
};

export default ManageAsset;
