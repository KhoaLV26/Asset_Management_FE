import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table, Modal, Dropdown, Menu, Select } from "antd";
import LayoutPage from "../layout/LayoutPage";
import { removeExtraWhitespace } from "../HandleString";
import {
  FilterOutlined,
  EditFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const data = [
  {
    id: "1",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "2",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "3",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "1",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "2",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "3",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "1",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "2",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "3",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "1",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "3",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "1",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "2",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "3",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  },
  {
    id: "1",
    assetCode: "A",
    assetName: "John Brown",
    category: "asd123",
    state: "Available",
  }
];


const sorterLog = () => {
  console.log("Sorted");
};
const ManageAsset = () => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      key: "name",
      width: "18%",
      sorter: () => sorterLog(),
      render: (text) => <a href="#">{text}</a>,
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      key: "name",
      width: "18%",
      sorter: () => sorterLog(),

      render: (text) => <a>{text}</a>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "18%",
      sorter: () => sorterLog(),
    },
    {
      title: "State",
      key: "state",
      dataIndex: "state",
      width: "18%",
      sorter: () => sorterLog(),
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
              setIsModalOpen(false);
              navigate("edit-user");
            }}
          >
            <EditFilled className="text-lg mb-1" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
              navigate("edit-user");
            }}
          >
            <CloseCircleOutlined className="text-red-600 text-lg mb-1" />
          </Button>
        </Space>
      ),
    },
  ];
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);
  const [type, setType] = useState("State");
  const [category, setCategory] = useState("Category")
  const [pageSize, setPageSize] = useState(15)
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState()
  const handleClicked = (data) => {
    setIsModalOpen(true)
    setSelectedAsset(data);
  }
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    console.log(pageNumber, pageSize, type, category, search);
  }, [pageSize, pageNumber, type, category, search])
  return (
    <LayoutPage>
      <div className="w-full">
        <h1 className="font-bold text-d6001c text-2xl">Asset List</h1>
        <div className="flex items-center justify-between mt-5">
          <Space.Compact>
            <Select
              open={openStateDropdown}
              defaultValue={type}
              onClick={() => setOpenStateDropdown(!openStateDropdown)}
              suffixIcon={<FilterOutlined onClick={() => setOpenStateDropdown(!openStateDropdown)} />}
              className="w-[100px]"
              onChange={(value) => setType(value)}
              onSelect={() => setOpenStateDropdown(!openStateDropdown)}
              options={[
                {
                  value: "Type",
                  label: "All",
                },
                {
                  value: "1",
                  label: "Available",
                },
                {
                  value: "2",
                  label: "Not available",
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
                {
                  value: "6",
                  label: "Not available",
                }
              ]}
            />
          </Space.Compact>
          <Space.Compact>
            <Select
              open={openCategoryDropdown}
              defaultValue={type}
              onClick={() => setOpenCategoryDropdown(!openCategoryDropdown)}
              suffixIcon={<FilterOutlined onClick={() => setOpenCategoryDropdown(!openCategoryDropdown)} />}
              className="w-[100px]"
              onChange={(value) => setCategory(value)}
              onSelect={() => setOpenCategoryDropdown(!openCategoryDropdown)}
              options={[
                {
                  value: "Type",
                  label: "All",
                },
                {
                  value: "1",
                  label: "Cat A",
                },
                {
                  value: "2",
                  label: "Cat B",
                }
              ]}
            />
          </Space.Compact>
          <div className="flex gap-10">
            <Space.Compact>
              <Search
                className="w-[300px]"
                maxLength={100}
                value={search}
                allowClear
                onChange={(e) => setSearch(e.target.value)}
                onBlur={(e) =>
                  setSearch(removeExtraWhitespace(e.target.value))
                }
                onSearch={() => {
                  if (search.length > 0) {
                    setSearch(search);
                  }
                }}
              />
            </Space.Compact>
            <Button
              className="flex items-center w-[200px] h-[32px] bg-d6001c"
              type="primary"
              size="large"
            >
              Create new asset
            </Button>
          </div>
        </div>
        <Table pagination={{ showSizeChanger: true, total: 30, showTotal: (total) => `Total ${total} items`, defaultPageSize: 15, onChange: page => setPageNumber(page), onShowSizeChange: (current, size) => { setPageSize(size) } }} className="mt-10" columns={columns} dataSource={data} onRow={(record) => {
          return {
            onClick: () => {
              handleClicked(record);
            },
          };
        }} />
        <Button type="primary" onClick={showModal}>
          Open Modal
        </Button>
        {selectedAsset && <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>{selectedAsset.id}</p>
        </Modal>}
      </div>
    </LayoutPage>
  )
}

export default ManageAsset