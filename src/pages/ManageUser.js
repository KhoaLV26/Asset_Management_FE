import React from 'react'
import { Space, Table, Tag } from 'antd';

  const data = [
    {
      key: '1',
      staffCode: "A",
      fullName: 'John Brown',
      userName: "asd123",
      joinedDate: "11/06/2024",
      type: "Staff"
    },
    {
        key: '2',
        staffCode: "B",
        fullName: 'John Brown',
        userName: "asd123",
        joinedDate: "11/06/2024",
        type: "Staff"
      },
      {
        key: '3',
        staffCode: "C",
        fullName: 'John Brown',
        userName: "asd123",
        joinedDate: "11/06/2024",
        type: "Staff"
      },
  ];

const ManageUser = () => {
    const sorterLog = () => {
        console.log("Sorted")
    }

    const columns = [
        {
            title: 'Staff Code',
            dataIndex: 'staffCode',
            key: 'name',
            width: "18%",
            sorter: () => sorterLog(),
            render: (text) => <a>{text}</a>,
        },
        {
          title: 'Full Name',
          dataIndex: 'fullName',
          key: 'name',
          width: "18%",
          sorter: () => sorterLog(),

          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Username',
          dataIndex: 'userName',
          key: 'username',
          width: "18%",
        },
        {
          title: 'Joined Date',
          dataIndex: 'joinedDate',
          key: 'joinedDate',
          width: "18%",
          sorter: () => sorterLog(),
        },
        {
          title: 'Type',
          key: 'type',
          dataIndex: 'type',
          width: "18%",
          sorter: () => sorterLog(),
        },
        {
          title: 'Action',
          key: 'action',
          width: "10%",
          render: (_, record) => (
            <Space size="middle">
              <a>Edit {record.name}</a>
              <a>Disable</a>
            </Space>
          ),
        },
      ];
    
  return (
    <div className="w-full">
        <h1 className="font-bold text-d6001c text-2xl">User List</h1>
        <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default ManageUser