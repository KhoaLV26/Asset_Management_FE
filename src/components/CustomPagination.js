import React, { useState, useEffect } from "react";
import { Pagination, Select } from "antd";

const { Option } = Select;

export const CustomPagination = ({ params, setParams, total, setFetch }) => {
  const [recordsPerPage, setRecordsPerPage] = useState(params.pageSize || 10);

  useEffect(() => {
    setParams((prev) => ({ ...prev, pageSize: recordsPerPage, pageNumber: 1 }));
    try {
      setFetch(true);
    } catch {}
  }, [recordsPerPage, setParams, setFetch]);

  const handleSelectChange = (value) => {
    setRecordsPerPage(value);
  };

  const itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return (
        <button
          type="button"
          className="ant-pagination-item-link items-center justify-center flex gap-2"
          style={{
            width: "70px",
            background: "white",
            color: "#d6001c",
            border: "1px solid #d6001c",
            borderRadius: "0",
          }}
        >
          Previous
        </button>
      );
    }
    if (type === "next") {
      return (
        <button
          type="button"
          className="ant-pagination-item-link items-center justify-center flex gap-2"
          style={{
            width: "70px",
            background: "white",
            color: "#d6001c",
            border: "1px solid #d6001c",
            borderRadius: "0",
          }}
        >
          Next
        </button>
      );
    }

    if (type === "page") {
      const isActive = current === params.pageNumber;

      return (
        <button
          type="button"
          className={`ant-pagination-item-link ${isActive ? "active" : ""}`}
          style={{
            width: "100%",
            background: isActive ? "#d6001c" : "white",
            color: isActive ? "white" : "#d6001c",
            border: "1px solid #d6001c",
            borderRadius: "0",
          }}
          onClick={() => {
            setParams((prev) => ({ ...prev, pageNumber: current }));
            try {
              setFetch(true);
            } catch {}
          }}
        >
          {current}
        </button>
      );
    }
    return originalElement;
  };

  const pageSizeConstant = [10, 20, 50, 100];

  return (
    <div className="flex gap-2">
      <Pagination
        className="text-center text-d6001c pb-5"
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} records`
        }
        current={params.pageNumber}
        pageSize={recordsPerPage}
        total={total}
        showSizeChanger={false}
        onChange={(page) => {
          setParams((prev) => ({ ...prev, pageNumber: page }));
          try {
            setFetch(true);
          } catch {}
        }}
        itemRender={itemRender}
      />
      <div className="flex items-center justify-center pb-[20px]">
        <Select
          className="custom-size-changer text-d6001c"
          style={{
            border: "1px solid #d6001c",
            borderRadius: "8px",
            color: "#d6001c"
          }}
          value={`${recordsPerPage} / page`}
          onChange={handleSelectChange}
        >
          {pageSizeConstant.map((option) => (
            <Option className="items-center justify-center" key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default CustomPagination;
