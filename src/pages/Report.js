import React, { useEffect, useState } from "react";
import LayoutPage from "../layout/LayoutPage";
import { Button, Spin, Table, message } from "antd";
import CustomPagination from "../components/CustomPagination";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import axiosInstance from "../axios/axiosInstance";
import "../styles/Home.css";

const Report = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    pageSize: 10,
    pageNumber: 1,
    sortBy: "",
    sortOrder: "asc",
  });
  const [direction, setDirection] = useState(true);
  const [total, setTotal] = useState(0);

  const sorterLog = (name) => {
    setLoading(true);
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

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/assets/reports", { params })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.totalCount);
      })
      .catch((err) => {
        message.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handleExport = () => {
    axiosInstance({
      url: "/assets/export-to-excel",
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "AssetReport.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        message.error(
          err.response?.data?.message || "Failed to download the file"
        );
      });
  };

  const columns = [
    {
      title: <span className="flex items-center justify-between">No</span>,
      dataIndex: "index",
      width: "6%",
      key: "index",
      render: (text, record, index) => (
        <span>{index + 1 + (params?.pageNumber - 1) * params.pageSize}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Category
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
      dataIndex: "category",
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
          Total
          {params.sortBy === "Total" ? (
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
      dataIndex: "total",
      key: "total",
      width: "9%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Total");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Assigned
          {params.sortBy === "Assigned" ? (
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
      dataIndex: "assigned",
      key: "assigned",
      width: "12%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Assigned");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Available
          {params.sortBy === "Available" ? (
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
      dataIndex: "available",
      key: "available",
      width: "11%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Available");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Not available
          {params.sortBy === "NotAvailable" ? (
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
      key: "notAvailable",
      dataIndex: "notAvailable",
      width: "14%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("NotAvailable");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Waiting for recycling
          {params.sortBy === "WaitingForRecycling" ? (
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
      key: "waitingForRecycling",
      dataIndex: "waitingForRecycling",
      width: "18%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("WaitingForRecycling");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex items-center justify-between">
          Recycled
          {params.sortBy === "Recycled" ? (
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
      key: "recycled",
      dataIndex: "recycled",
      width: "13%",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          sorterLog("Recycled");
        },
      }),
      render: (text) => <span>{text}</span>,
    },
  ];

  return (
    <LayoutPage>
      <div className="w-full mt-10">
        <h1 className="font-bold text-d6001c text-2xl">Report</h1>
        <div className="flex justify-end">
          <Button
            className="flex mt-7 h-[32px] bg-d6001c"
            type="primary"
            size="large"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
        <Spin spinning={loading}>
          <div className="justify-center items-center mt-0 w-full">
            <Table
              pagination={false}
              scroll={{ y: 550 }}
              className="viewtable mt-10 h-[630px]"
              columns={columns}
              dataSource={data}
              defaultPageSize={15}
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

export default Report;
