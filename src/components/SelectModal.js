import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import {
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";

const { Search } = Input;
export const SelectModal = ({ setisShowModal, params, setParams
  //, columns, data 
}) => {
  const [direction, setDirection] = useState(true)
  const [searchQuery, setSearchQuery] = useState("");

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
      width: "18%",
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
      width: "18%",
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
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Role");
        },
      }),
      render: (text) => <span>{text}</span>,
    }
  ]

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
      width: "18%",
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Category");
        },
      }),
      render: (text) => <span>{text}</span>,
    }
  ]

  const columns = [
    {
      title: "Full Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Age",
      width: 100,
      dataIndex: "age",
      key: "age",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Column 1",
      dataIndex: "address",
      key: "1",
    },
    {
      title: "Column 2",
      dataIndex: "address",
      key: "2",
    },
    {
      title: "Column 3",
      dataIndex: "address",
      key: "3",
    },
    {
      title: "Column 4",
      dataIndex: "address",
      key: "4",
    },
    {
      title: "Column 5",
      dataIndex: "address",
      key: "5",
    },
    {
      title: "Column 6",
      dataIndex: "address",
      key: "6",
    },
    {
      title: "Column 7",
      dataIndex: "address",
      key: "7",
    },
    {
      title: "Column 8",
      dataIndex: "address",
      key: "8",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: () => <a>action</a>,
    },
  ];
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }

  const handleSearch = (query) => {
    console.log(removeExtraWhitespace(query))
  }

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
            Select User
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
        <div className="flex flex-wrap gap-1">
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ y: 400 }}
            rowSelection={{ type: "radio" }}
          />
          <div className="flex gap-5 justify-end w-full">
            <Button
              className="bg-d6001c w-[7%] text-white"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Save
            </Button>
            <Button
              className="w-[7%] text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectModal;
