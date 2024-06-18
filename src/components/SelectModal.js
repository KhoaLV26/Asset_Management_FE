import React, { useState, useEffect } from "react";
import { Table, Button, Input, message } from "antd";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import CustomPagination from "./CustomPagination";
import axiosInstance from "../axios/axiosInstance";

const { Search } = Input;
export const SelectModal = ({
  setisShowModal,
  type,
  setName,
  setId,
  chosenId,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [direction, setDirection] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [url, setURL] = useState("");
  const [columns, setColumns] = useState([]);
  const [params, setParams] = useState({
    location: "cde5153d-3e0d-4d8c-9984-dfe6a9b8c2b1",
    search: searchQuery,
    role: "",
    sortBy: "StaffCode",
    sortDirection: "asc",
    pageNumber: 1,
  });

  useEffect(() => {
    if (type === "Select User") {
      setURL(`/Users`);
      setColumns(userColumns);
    }
    if (type === "Select Asset") {
      setURL(`/Assets`);
      setColumns(assetColumns);
    }
    if (url !== "") {
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
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  }, [params, type, url]);

  const sorterLog = (name) => {
    if (params.sortBy === name) {
      if (direction === true) {
        setParams((prev) => ({ ...prev, sortDirection: "desc" }));
      } else {
        setParams((prev) => ({ ...prev, sortDirection: "asc" }));
      }
      setDirection(!direction);
    } else {
      setParams((prev) => ({ ...prev, sortBy: name }));
      setDirection(true);
      setParams((prev) => ({ ...prev, sortDirection: "asc" }));
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
            params.sortDirection === "asc" ? (
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
            params.sortDirection === "asc" ? (
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
      width: "70%",
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
          Type{" "}
          {params.sortBy === "Role" ? (
            params.sortDirection === "asc" ? (
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
            params.sortDirection === "asc" ? (
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
            params.sortDirection === "asc" ? (
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
      width: "70%",
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
            params.sortDirection === "asc" ? (
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
      width: "10%",
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
      const firstKey = type === "Select User" ? data[0].staffCode : data[0].assetCode;
      const name = type === "Select User" ? data[0].fullName : data[0].assetName 
      setSelectedRowKeys([firstKey]);
      setCurrentName(name);
      setCurrentId(firstKey);
      (type === "Select User") ? setParams((prev) => ({ ...prev, newStaffCode: chosenId })) : setParams((prev) => ({ ...prev, newAssetCode: chosenId }));
    }
  }, [data]);

  const handleSearch = (value) => {
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
            onSearch={() => {
              setSearchQuery(searchQuery.trim());
              handleSearch(searchQuery);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-1 mx-8">
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => {
              if (type=== "Select User") return record.staffCode
              if (type=== "Select Asset") return record.assetCode
            }}
            rowSelection={{
              type: "radio",
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRow) => {
                setSelectedRowKeys(selectedRowKeys);
                console.log(selectedRow[0])
                if (type === "Select User") {
                  setCurrentName(selectedRow[0].fullName);
                  setCurrentId(selectedRow[0].staffCode);
                }
                if (type === "Select Asset") {
                  setCurrentName(selectedRow[0].assetName);
                  setCurrentId(selectedRow[0].assetCode);
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
              total={total}
            />
          </div>
        </div>
        <div className="flex gap-5 justify-end w-full px-6 py-5">
          <Button
            className="bg-d6001c w-[7%] text-white"
            onClick={(e) => {
              e.stopPropagation();
              setName(currentName);
              setId(currentId);
              setisShowModal(false);
            }}
          >
            Save
          </Button>
          <Button
            className="w-[7%] text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              setisShowModal(false);
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