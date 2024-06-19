import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table, Modal, Select, message, Empty, DatePicker } from "antd";
import LayoutPage from "../layout/LayoutPage";
import { removeExtraWhitespace } from "../HandleString";
import {
    FilterOutlined,
    EditFilled,
    CloseCircleOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    RedoOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import "../styles/ManageAsset.css";
import CustomPagination from "../components/CustomPagination";
const initialData = [
    {
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
const { Search } = Input;
const formatDateTime = (input) => {
    // Tạo một đối tượng Date từ chuỗi input
    let date = new Date(input);

    // Lấy phần ngày và phần thời gian
    let datePart = date.toISOString().split('T')[0];
    let timePart = date.toISOString().split('T')[1].split('.')[0];

    // Ghép lại thành chuỗi đã định dạng
    let formattedDateTime = datePart + ' ' + timePart;

    return formattedDateTime;
}
const stateConvert = (id) => {
    let stateName = "";
    switch (id) {
        case 1:
            stateName = "Acceptance";
            break;
        case 2:
            stateName = "Waiting for acceptance";
            break;
        default:
            stateName = "Declined";
            break;
    }
    return stateName
};

const ManageAssignment = () => {
    const [direction, setDirection] = useState(true);
    const [total, setTotal] = useState(1);
    // const [data, setData] = useState([]);
    const handleSearch = (value) => {
        setParams((prev) => ({ ...prev, pageNumber: 1, search: value }));
    };
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [openStateDropdown, setOpenStateDropdown] = useState(false);
    const handleClicked = (data) => {
        setIsModalOpen(true);
        setSelectedAsset(data);
    };
    const [selectedAsset, setSelectedAsset] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState({ pageNumber: 1 });
    const sorterLog = (name) => {
        if (params.sortBy === name) {
            if (direction === true) {
                setParams((prev) => ({ ...prev, sortOrder: "asc" }));
            } else {
                setParams((prev) => ({ ...prev, sortOrder: "desc" }));
            }
            setDirection(!direction);
        } else {
            setParams((prev) => ({ ...prev, sortBy: name }));
            setDirection(true);
            setParams((prev) => ({ ...prev, sortOrder: "desc" }));
        }
    };
    // const columns = [
    //     {
    //         title: "No",
    //         dataIndex: "index",
    //         width: "6%",
    //         key: "index",
    //         sorter: (a, b, indexA, indexB) => indexA - indexB,
    //         render: (text, record, index) => <span>{params.sortOrder !== "desc" ? index + 1 + ((params?.pageNumber - 1) * 10) : ((params?.pageNumber - 1) * 10) - index - 1}</span>
    //     },
    //     {
    //         title: (
    //             <span className="flex items-center justify-between">
    //                 Asset Code{" "}
    //                 {params.sortBy === "AssetCode" ? (
    //                     params.sortOrder === "desc" ? (
    //                         <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
    //                     ) : (
    //                         <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                     )
    //                 ) : (
    //                     <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                 )}
    //             </span>
    //         ),
    //         dataIndex: "assetCode",
    //         key: "name",
    //         ellipsis: true,
    //         onHeaderCell: () => ({
    //             onClick: () => {
    //                 sorterLog("AssetCode");
    //             },
    //         }),
    //         render: (text) => <span>{text}</span>,
    //     },
    //     {
    //         title: (
    //             <span className="flex items-center justify-between">
    //                 Asset Name{" "}
    //                 {params.sortBy === "AssetName" ? (
    //                     params.sortOrder === "desc" ? (
    //                         <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
    //                     ) : (
    //                         <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                     )
    //                 ) : (
    //                     <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                 )}
    //             </span>
    //         ),
    //         dataIndex: "assetName",
    //         key: "name",
    //         ellipsis: true,
    //         onHeaderCell: () => ({
    //             onClick: () => {
    //                 sorterLog("AssetName");
    //             },
    //         }),
    //         render: (text) => <span>{text}</span>,
    //     },
    //     {
    //         title: (
    //             <span className="flex items-center justify-between">
    //                 Assigned To{" "}
    //                 {params.sortBy === "AssignedTo" ? (
    //                     params.sortOrder === "desc" ? (
    //                         <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
    //                     ) : (
    //                         <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                     )
    //                 ) : (
    //                     <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                 )}
    //             </span>
    //         ),
    //         dataIndex: "to",
    //         key: "assignedTo",
    //         ellipsis: true,
    //         onHeaderCell: () => ({
    //             onClick: () => {
    //                 sorterLog("AssignedTo");
    //             },
    //         }),
    //         render: (text) => <span>{text}</span>,
    //     },
    //     {
    //         title: (
    //             <span className="flex items-center justify-between">
    //                 Assigned By{" "}
    //                 {params.sortBy === "AssignedBy" ? (
    //                     params.sortOrder === "desc" ? (
    //                         <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
    //                     ) : (
    //                         <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                     )
    //                 ) : (
    //                     <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                 )}
    //             </span>
    //         ),
    //         key: "assignedBy",
    //         dataIndex: "by",
    //         ellipsis: true,
    //         onHeaderCell: () => ({
    //             onClick: () => {
    //                 sorterLog("AssignedBy");
    //             },
    //         }),
    //         render: (text) => <span>{text}</span>,
    //     },
    //     {
    //         title: (
    //             <span className="flex items-center justify-between">
    //                 Assigned Date{" "}
    //                 {params.sortBy === "AssignedDate" ? (
    //                     params.sortOrder === "desc" ? (
    //                         <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
    //                     ) : (
    //                         <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                     )
    //                 ) : (
    //                     <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                 )}
    //             </span>
    //         ),
    //         key: "assignedDate",
    //         dataIndex: "assignedDate",
    //         ellipsis: true,
    //         onHeaderCell: () => ({
    //             onClick: () => {
    //                 sorterLog("AssignedDate");
    //             },
    //         }),
    //         render: (text) => <span>{text.slice(0, 10)}</span>,
    //     },
    //     {
    //         title: (
    //             <span className="flex items-center justify-between">
    //                 State{" "}
    //                 {params.sortBy === "State" ? (
    //                     params.sortOrder === "desc" ? (
    //                         <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
    //                     ) : (
    //                         <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                     )
    //                 ) : (
    //                     <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
    //                 )}
    //             </span>
    //         ),
    //         key: "state",
    //         dataIndex: "state",
    //         ellipsis: true,
    //         onHeaderCell: () => ({
    //             onClick: () => {
    //                 sorterLog("State");
    //             },
    //         }),
    //         render: (text) => <span>{text}</span>,
    //     },
    //     {
    //         title: "",
    //         key: "action",
    //         width: "16%",
    //         ellipsis: true,
    //         render: (_, record) => (
    //             <Space size="middle">
    //                 <Button size="small"
    //                     disabled={record?.state === "Accepted"}
    //                     onClick={(e) => {
    //                         e.stopPropagation();
    //                         navigate("edit-asset");
    //                     }}
    //                 >
    //                     <EditFilled className="text-sm mb-1" />
    //                 </Button>
    //                 <Button size="small"
    //                     disabled={record?.state === "Accepted"}
    //                     onClick={(e) => {
    //                         e.stopPropagation();
    //                         navigate("delete-asset");
    //                     }}
    //                 >
    //                     <CloseCircleOutlined className="text-red-600 text-sm mb-1" />
    //                 </Button>
    //                 <Button size="small"
    //                     disabled={record?.state === "Waiting for acceptance"}
    //                     onClick={(e) => {
    //                         e.stopPropagation();
    //                         navigate("delete-asset");
    //                     }}
    //                 >
    //                     <RedoOutlined className="text-blue-600 text-sm mb-1" />
    //                 </Button>
    //             </Space>
    //         ),
    //     },
    // ];
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const isFirstTimeAssignment = sessionStorage.getItem("isFirstTimeAssignment") === null;
        if (isFirstTimeAssignment) {
            if (location?.state?.data) {
                setParams((prev) => ({ ...prev, newAssetCode: location.state.data.assetCode }));
            }
            sessionStorage.setItem("isFirstTimeAssignment", "false");
        } else {
            setParams((prev) => ({ ...prev, newAssetCode: "" }));
        }

        return () => {
            sessionStorage.removeItem("isFirstTimeAssignment");
        };
    }, [location]);

    useEffect(() => {
        axiosInstance
            .get("/Assignments", { params })
            .then((res) => {
                if (res.data.success) {
                    setTotal(res.data.totalCount);
                    setData(res.data.data.map((asset, index) => ({
                        key: index,
                        ...asset,
                        state: stateConvert(asset.status),
                    })))
                }
            }
            )
            .catch((err) => {
                console.log(err);
                if (err.response?.status === 409) {
                    setData([])
                    setTotal(0)
                } else message.error(err.message);
            });
    }, [params]);



    useEffect(() => {
        if (isModalOpen) {
            axiosInstance
                .get(`/Assets/${selectedAsset.id}`)
                .then((res) => {
                    if (res.data.success) {
                        setSelectedAsset(res.data.data);
                    } else {
                        message.error(res.data.message);
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
    }, [isModalOpen]);





    const [data, setData] = useState(initialData);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    // Define the columns for the table
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
            render: (text, record, index) => index + 1,
            sorter: (a, b) => {
              if (sortOrder === 'asc') {
                return a.no - b.no;
              } else {
                return b.no - a.no;
              }
            },
            sortOrder: sortOrder === 'asc' ? 'ascend' : 'descend',
            onHeaderCell: () => ({
              onClick: () => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              },
            }),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    // Add unique keys to data for table rows
    const dataWithKeys = data.map((item, index) => ({ ...item, key: index }));










    return (
        // <LayoutPage>
        //     <div className="w-full mt-10">
        //         <h1 className="font-bold text-d6001c text-2xl">Assignment List</h1>
        //         <div className="flex items-center justify-between mt-7 mb-2">
        //             <Space.Compact>
        //                 <Select
        //                     open={openStateDropdown}
        //                     defaultValue={"State"}
        //                     suffixIcon={<FilterOutlined style={{ fontSize: "16px" }} onClick={() => setOpenStateDropdown(!openStateDropdown)} />}
        //                     className="w-[250px]"
        //                     onChange={(value) =>
        //                         setParams((prev) => ({ ...prev, state: value, pageNumber: 1 }))
        //                     }
        //                     onSelect={() => setOpenStateDropdown(!openStateDropdown)}
        //                     options={[
        //                         {
        //                             value: "All",
        //                             label: "All",
        //                         },
        //                         {
        //                             value: "1",
        //                             label: "Accepted",
        //                         },
        //                         {
        //                             value: "2",
        //                             label: "Waiting for acceptance",
        //                         },
        //                         {
        //                             value: "3",
        //                             label: "Declined",
        //                         },
        //                     ]}
        //                 />
        //             </Space.Compact>
        //             <Space.Compact>
        //                 <DatePicker className="w-[250px]" format="YYYY-MM-DD" placeholder="Assigned Date" onChange={(value) =>
        //                     setParams((prev) => ({ ...prev, pageNumber: 1, assignedDate: value?.format("YYYY-MM-DD") }))
        //                 } />
        //             </Space.Compact>
        //             <div className="flex gap-10">
        //                 <Space.Compact>
        //                     <Search
        //                         className="w-[300px]"
        //                         maxLength={100}
        //                         placeholder="Enter text"
        //                         value={searchQuery}
        //                         allowClear
        //                         onChange={(e) => setSearchQuery(e.target.value)}
        //                         onSearch={() => {
        //                             setSearchQuery(searchQuery.trim());
        //                             handleSearch(removeExtraWhitespace(searchQuery));
        //                         }}
        //                     />
        //                 </Space.Compact>
        //                 <Button
        //                     className="flex items-center w-[200px] h-[32px] bg-d6001c"
        //                     type="primary"
        //                     size="large"
        //                     onClick={() => {
        //                         navigate("create-asset");
        //                     }}
        //                 >
        //                     Create new assignment
        //                 </Button>
        //             </div>
        //         </div>
        //         <div className="justify-center items-center mt-0">
        //             {console.log(data)}
        //             <Table
        //                 locale={{
        //                     emptyText: (
        //                         <Empty
        //                             image={Empty.PRESENTED_IMAGE_SIMPLE}
        //                             description="No Search Result"
        //                         />
        //                     ),
        //                 }}
        //                 pagination={false}
        //                 className="mt-10"
        //                 columns={columns}
        //                 dataSource={data}
        //                 defaultPageSize={15}
        //                 onRow={(record) => {
        //                     return {
        //                         onDoubleClick: () => {
        //                             handleClicked(record);
        //                         },
        //                     };
        //                 }}
        //                 rowKey="key"
        //             />
        //             <div className="w-full flex justify-end">
        //                 <CustomPagination
        //                     params={params}
        //                     setParams={setParams}
        //                     total={total}
        //                 />
        //             </div>
        //         </div>
        //         {console.log(selectedAsset)}
        //         <Modal
        //             title={
        //                 <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
        //                     Detailed Asset Information
        //                 </h3>
        //             }
        //             open={isModalOpen}
        //             onCancel={handleCancel}
        //             footer={null}
        //             className="custom-modal"
        //         >
        //             <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
        //                 <div className="flex mb-[10px]">
        //                     <span className="font-bold w-[150px]">Asset Code:</span>
        //                     <span>{selectedAsset?.assetCode}</span>
        //                 </div>
        //                 <div className="flex mb-[10px]">
        //                     <span className="font-bold w-[150px]">Asset Name:</span>
        //                     <span>{selectedAsset?.assetName}</span>
        //                 </div>
        //                 <div className="flex mb-[10px]">
        //                     <span className="font-bold w-[150px]">State:</span>
        //                     <span>{stateConvert(selectedAsset?.status)}</span>
        //                 </div>
        //                 <div className="flex mb-[10px]">
        //                     <span className="font-bold w-[150px]">History Assignment:</span>
        //                 </div>
        //                 <div className="mb-[10px]">
        //                     {selectedAsset?.assignmentResponses?.map((item) => (
        //                         <div>
        //                             <span> Time: {item.assignedDate.slice(0, 10)} </span>
        //                             <span> | </span>
        //                             <span> Assigned By: {item.by}</span>
        //                             <span> Assigned To: {item.to}</span>
        //                         </div>
        //                     )
        //                     )}
        //                 </div>
        //             </div>
        //         </Modal>
        //     </div>
        // </LayoutPage>
        <div>
            <Table
                columns={columns}
                dataSource={dataWithKeys}
                rowKey="key" // Use "key" as the unique identifier
            />
        </div>
    );
};

export default ManageAssignment;
