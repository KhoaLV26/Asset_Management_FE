import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Dropdown,
  Menu,
  Select,
  Pagination,
  message,
} from "antd";
import LayoutPage from "../layout/LayoutPage";
import { removeExtraWhitespace } from "../HandleString";
import {
  FilterOutlined,
  EditFilled,
  CloseCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import "../styles/ManageAsset.css";

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
  return <span>{stateName}</span>;
};

const ManageAsset = () => {
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, currentPage: 1, search: value }));
  };
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const handleClicked = (data) => {
    setIsModalOpen(true);
    setSelectedAsset(data);
  };
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [params, setParams] = useState({});
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
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("State");
        },
      }),
      render: (text) => <span>{text}</span>,
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
              navigate("edit-asset");
            }}
          >
            <EditFilled className="text-lg mb-1" />
          </Button>
          <Button
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
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    console.log(params);
    axiosInstance
      .get("/Assets", { params })
      .then((res) => {
        if (res.data.success) {
          setData(
            res.data.data.map((asset) => ({
              ...asset,
              state: stateConvert(asset.status),
            }))
          );
          setTotal(res.data.totalCount);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
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
      console.log(selectedAsset);
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
      <div className="w-full">
        <h1 className="font-bold text-d6001c text-2xl">Asset List</h1>
        <div className="flex items-center justify-between mt-5">
          <Space.Compact>
            <Select
              open={openStateDropdown}
              defaultValue={"State"}
              suffixIcon={
                <FilterOutlined
                  onClick={() => setOpenStateDropdown(!openStateDropdown)}
                />
              }
              className="w-[250px]"
              onChange={(value) =>
                setParams((prev) => ({ ...prev, state: value }))
              }
              onSelect={() => setOpenStateDropdown(!openStateDropdown)}
              options={[
                {
                  value: "",
                  label: "Defaults",
                },
                {
                  value: "2",
                  label: "Available",
                },
                {
                  value: "1",
                  label: "Not available",
                },
                {
                  value: "3",
                  label: "Assigned",
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
                  onClick={() => setOpenCategoryDropdown(!openCategoryDropdown)}
                />
              }
              className="w-[250px]"
              onChange={(value) =>
                setParams((prev) => ({ ...prev, category: value }))
              }
              onSelect={() => setOpenCategoryDropdown(!openCategoryDropdown)}
              options={categories.map((c) => {
                return { value: c.id, label: c.name };
              })}
            />
          </Space.Compact>
          <div className="flex gap-10">
            <Space.Compact>
              <Search
                className="w-[300px]"
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
              className="flex items-center w-[200px] h-[32px] bg-d6001c"
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
        <Table
          pagination={false}
          className="mt-10"
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
          <Pagination
            className="text-center text-d6001c"
            defaultCurrent={params.pageNumber}
            defaultPageSize={15}
            total={total}
            onChange={(page) =>
              setParams((prev) => ({ ...prev, currentPage: page }))
            }
            itemRender={itemRender}
          />
        </div>

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
              <span>{stateConvert(selectedAsset?.state)}</span>
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
              ))}
              {/* {selectedAsset?.assignmentResponses?.map(i => <h1>{i.id}</h1>)} */}
            </div>
          </div>
        </Modal>
      </div>
    </LayoutPage>
  );
};

export default ManageAsset;
