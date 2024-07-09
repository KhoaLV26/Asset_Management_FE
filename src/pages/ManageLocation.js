import React, { useEffect, useState } from "react";
import {
  Button,
  Space,
  Table,
  message,
  Empty,
  Spin,
  Input,
} from "antd";
import {
  EditFilled,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import axiosInstance from "../axios/axiosInstance";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import LayoutPage from "../layout/LayoutPage";
import { CustomPagination } from "../components";
import { useLocation, useNavigate } from "react-router-dom";

const { Search } = Input;

export const ManageLocation = () => {
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, pageNumber: 1, search: value }));
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
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
          Name{" "}
          {params.sortBy === "Name" ? (
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
      dataIndex: "name",
      key: "name",
      width: "65%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Name");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Code{" "}
          {params.sortBy === "Code" ? (
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
      dataIndex: "code",
      key: "code",
      width: "15%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Code");
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
            size="middle"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`edit-location/${record.id}`);
            }}
          >
            <EditFilled className="text-sm mb-1 " />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const isFirstTimeLocation =
      sessionStorage.getItem("isFirstTimeLocation") === null;
    if (isFirstTimeLocation) {
      if (location?.state?.data) {
        setParams((prev) => ({
          ...prev,
          newLocationCode: location.state.data.code,
        }));
      }
      sessionStorage.setItem("isFirstTimeLocation", "false");
    } else {
      setParams((prev) => ({ ...prev, newLocationCode: "" }));
    }

    return () => {
      sessionStorage.removeItem("isFirstTimeLocation");
    };
  }, [location]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/locations", { params })
      .then((res) => {
        if (res.data.success) {
          setTotal(res.data.totalCount);
          setData(
            res.data.data.map((location, index) => ({
              key: index,
              ...location,
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
        <h1 className="font-bold text-d6001c text-2xl">Location List</h1>
        <div className="flex items-center justify-between mt-7 mb-2">
          <div className="flex gap-10 w-[30%]"></div>
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
                navigate("create-location");
              }}
            >
              Create new location
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
              className="viewtable mt-10 h-[730px]"
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

export default ManageLocation;
