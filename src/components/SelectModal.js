import React, { useState, useEffect } from "react";
import { Table, Button, Input, message, Empty } from "antd";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import CustomPagination from "./CustomPagination";
import axiosInstance from "../axios/axiosInstance";
import dayjs from "dayjs";

const { Search } = Input;
export const SelectModal = ({
  setisShowModal,
  type,
  setName,
  setId,
  chosenCode,
  setCode,
  date,
  setDate,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [direction, setDirection] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [currentDate, setCurrentDate] = useState(date);
  const [currentCode, setCurrentCode] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [columns, setColumns] = useState([]);
  const [fetched, setFetched] = useState(true);
  const [params, setParams] = useState({
    search: searchQuery,
    sortBy: type === "Select User" ? "StaffCode" : "AssetCode",
    sortOrder: "asc",
    pageNumber: 1,
    state: 2,
    newStaffCode: chosenCode,
    newAssetCode: chosenCode,
  });

  const url = type === "Select User" ? "/Users" : "/Assets";

  useEffect(() => {
    if (type === "Select User") {
      setColumns(userColumns);
    }
    if (type === "Select Asset") {
      setColumns(assetColumns);
    }
    if (url !== "") {
      fetched &&
        axiosInstance
          .get(url, { params })
          .then((res) => {
            if (res.data.success) {
              setData(
                res.data.data
                  .map((user) => ({
                    ...user,
                    fullName: `${user?.firstName} ${user?.lastName}`,
                  }))
                  .map((asset) => ({
                    ...asset,
                    state: stateConvert(asset?.status),
                  }))
              );
              setTotal(res.data.totalCount);
              setFetched(false);
            } else {
              message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.response?.status === 409) {
              setData([]);
              setTotal(0);
            } else message.error(err.message);
          });
    }
  }, [params, type]);

  const sorterLog = (name) => {
    setFetched(true);
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

  const userColumns = [
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
      width: "15%",
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
      width: "55%",
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
      width: "15%",
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
      width: "10%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Role");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
  ];

  const assetColumns = [
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
      key: "assetcode",
      width: "15%",
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
      key: "assetName",
      width: "60%",
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
      key: "categoryName",
      dataIndex: "categoryName",
      width: "20%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Category");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
  ];

  useEffect(() => {
    if (data.length > 0) {
      const firstKey =
        type === "Select User" ? data[0].staffCode : data[0].assetCode;
      const name =
        type === "Select User" ? data[0].fullName : data[0].assetName;
      const id = data[0].id;
      if (params.pageNumber === 1) {
        chosenCode && setSelectedRowKeys([firstKey]);
        chosenCode && setCurrentName(name);
        chosenCode && setCurrentId(id);
      }
    }
  }, [data]);

  console.log(currentId);

  const handleSearch = (value) => {
    setFetched(true);
    setParams((prev) => ({ ...prev, pageNumber: 1 }));

    setParams((prev) => ({
      ...prev,
      search: removeExtraWhitespace(value),
    }));
  };

  return (
    <div
      onClick={() => {
        setisShowModal(false);
      }}
      className="fixed top-0 left-0 right-0 bottom-0 z-20 bg-overlay-70 flex justify-center items-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setisShowModal(true);
        }}
        className="w-2/3 bg-white rounded-md"
      >
        <div className="flex items-center justify-between mt-7">
          <span className="text-2xl ml-5 text-d6001c font-extrabold">
            {type}
          </span>
          <Search
            className="w-[40%] mr-9"
            value={searchQuery}
            allowClear
            maxLength={100}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={(value, event, input) => {
              if (input.source !== "clear") {
                setSearchQuery(searchQuery.trim());
                handleSearch(searchQuery);
              }
            }}
          />
        </div>
        <div className="flex flex-wrap gap-1 mx-8">
          <Table
            columns={columns}
            dataSource={data}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No Search Result"
                />
              ),
            }}
            rowKey={(record) => {
              if (type === "Select User") return record.staffCode;
              if (type === "Select Asset") return record.assetCode;
            }}
            rowSelection={{
              type: "radio",
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRow) => {
                console.log(selectedRow);
                setSelectedRowKeys(selectedRowKeys);
                if (type === "Select User") {
                  setCurrentName(selectedRow[0].fullName);
                  setCurrentId(selectedRow[0].id);
                  setCurrentCode(selectedRow[0].staffCode);
                  if (
                    dayjs(selectedRow[0].dateJoined, "YYYY-MM-DD").format(
                      "YYYY-MM-DD"
                    ) > date
                  ) {
                    setCurrentDate(
                      dayjs(selectedRow[0].dateJoined, "YYYY-MM-DD").format(
                        "YYYY-MM-DD"
                      )
                    );
                  } else {
                    setCurrentDate(date);
                  }
                }
                if (type === "Select Asset") {
                  setCurrentName(selectedRow[0].assetName);
                  setCurrentId(selectedRow[0].id);
                  setCurrentCode(selectedRow[0].assetCode);
                }
              },
            }}
            scroll={{ y: 400 }}
            pagination={false}
          />
          <div className="w-full flex justify-end">
            <CustomPagination
              params={params}
              setParams={setParams}
              setFetch={setFetched}
              total={total}
            />
          </div>
        </div>
        <div className="flex gap-5 justify-end w-full px-6 py-5">
          <Button
            className="bg-d6001c w-[7%] text-white"
            disabled={!currentId}
            onClick={(e) => {
              e.stopPropagation();
              setName(currentName);
              setId(currentId);
              setCode(currentCode);
              try {
                setDate(currentDate);
              } catch {}
              setisShowModal(false);
            }}
          >
            Save
          </Button>
          <Button
            className="w-[7%] text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRowKeys(null);
              setCurrentName(null);
              setCurrentId(null);
              setisShowModal(false);
              setData(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectModal;
