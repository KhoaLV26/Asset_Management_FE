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
import { removeExtraWhitespace } from "../HandleString";
import {
  FilterOutlined,
  CheckOutlined,
  CloseOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import "../styles/ManageAsset.css";
import CustomPagination from "../components/CustomPagination";

const { Search } = Input;
const stateConvert = (id) => {
  let stateName = "";
  switch (id) {
    case 1:
      stateName = "Waiting for returning";
      break;
    case 2:
      stateName = "Completed";
      break;
  }
  return stateName;
};

const ManageRequestReturn = () => {
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, pageNumber: 1, SearchTerm: value }));
  };
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  const [params, setParams] = useState({ pageNumber: 1 });
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
      width: "6%",
      key: "index",
      render: (text, record, index) => (
        <span>{index + 1 + (params?.pageNumber - 1) * 10}</span>
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
          Requested by{" "}
          {params.sortBy === "RequestedBy" ? (
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
      dataIndex: "requestedByName",
      key: "requestedByName",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("RequestedBy");
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
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("AssignedDate");
        },
      }),
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Accepted By{" "}
          {params.sortBy === "AcceptedBy" ? (
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
      key: "acceptanceByName",
      dataIndex: "acceptanceByName",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("AcceptedBy");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Returned Date{" "}
          {params.sortBy === "ReturnedDate" ? (
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
      key: "returnDate",
      dataIndex: "returnDate",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("ReturnedDate");
        },
      }),
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
      key: "returnStatus",
      dataIndex: "returnStatus",
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
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="bg-tranparent border-none"
            size="middle"
            disabled={record?.returnStatus === "Completed"}
          >
            <CheckOutlined className="text-red-600 text-sm mb-1" />
          </Button>

          <Button
            className="bg-tranparent border-none"
            size="middle"
            disabled={record?.returnStatus === "Completed"}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <CloseOutlined className="text-sm mb-1 " />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/request-for-returning", { params })
      .then((res) => {
        if (res.data.success) {
          setTotal(res.data.totalCount);
          setData(
            res.data.data.map((asset, index) => ({
              key: index,
              ...asset,
              returnStatus: stateConvert(asset.returnStatus),
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
      <div className="w-full mt-10">
        <h1 className="font-bold text-d6001c text-2xl">Request List</h1>
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
              className="w-[200px]"
              onChange={(value) =>
                setParams((prev) => ({ ...prev, status: value, pageNumber: 1 }))
              }
              onDropdownVisibleChange={(isOpen) => setOpenStateDropdown(isOpen)}
              options={[
                {
                  value: "0",
                  label: "All",
                },
                {
                  value: "1",
                  label: "Waiting for returning",
                },
                {
                  value: "2",
                  label: "Completed",
                },
              ]}
            />
            <DatePicker
              inputReadOnly
              className="w-[100%]"
              format="YYYY-MM-DD"
              placeholder="Returned Date"
              onChange={(value) =>
                setParams((prev) => ({
                  ...prev,
                  pageNumber: 1,
                  returnDate: value?.format("YYYY-MM-DD"),
                }))
              }
            />
          </div>
          <div className="flex gap-10">
            <Space.Compact>
              <Search
                className="w-[100%]"
                maxLength={100}
                placeholder="Enter text"
                value={searchQuery}
                allowClear
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={(value, event, input) => {
                  if (input.source !== 'clear') {
                    setSearchQuery(searchQuery.trim());
                    handleSearch(removeExtraWhitespace(searchQuery));
                  }
                }}
              />
            </Space.Compact>
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
              defaultPageSize={10}
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
      </div>
    </LayoutPage>
  );
};

export default ManageRequestReturn;
