import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table, Modal, Dropdown, Menu } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import LayoutPage from "../layout/LayoutPage";

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
        <a>Edit {record.name}</a>
        <a>Disable</a>
      </Space>
    ),
  },
];

const sorterLog = () => {
  console.log("Sorted");
};
const ManageAsset = () => {
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
  const dropdownCategoryItems = [
    {
      key: '1',
      label: 'Cat 1',
      onClick: () => setCategory('Cat 1'),
    },
    {
      key: '2',
      label: 'Cat 2',
      onClick: () => setCategory('Cat 2'),
    },
  ];
  const dropdownStateItems = [
    {
      key: '1',
      label: 'Available',
      onClick: () => setType('Available'),
    },
    {
      key: '2',
      label: 'Not available',
      onClick: () => setType('Not available'),
    },
    {
      key: '3',
      label: 'Assigned',
      onClick: () => setType('Assigned'),
    },
    {
      key: '4',
      label: 'Waiting for recycling',
      onClick: () => setType('Waiting for recycling'),
    },
    {
      key: '5',
      label: 'Recycled',
      onClick: () => setType('Recycled'),
    },
    {
      key: '6',
      label: 'All',
      onClick: () => setType('All'),
    }
  ];

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
            <Input disabled={true} value={type} className="w-[200px]" />
            <Dropdown placement="bottomRight" menu={{ items: dropdownStateItems, selectable: true }} trigger={['click']}>
              <FilterOutlined className="h-[32px] w-[32px] flex items-center justify-center border-2 cursor-pointer" />
            </Dropdown>
          </Space.Compact>
          <Space.Compact>
            <Input disabled={true} value={category} className="w-[200px]" />
            <Dropdown placement="bottomRight" menu={{ items: dropdownCategoryItems, selectable: true }} trigger={['click']}>
              <FilterOutlined className="h-[32px] w-[32px] items-center justify-center border-2" />
            </Dropdown>
          </Space.Compact>
          <div className="flex gap-10">
            <Space.Compact>
              <Search className="w-[300px]" maxLength={100} value={search} onSearch={(value) => setSearch(value)} />
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