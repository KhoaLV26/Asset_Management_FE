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
            stateName = "Accepted";
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
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortPos, setSortPos] = useState(false);
    const [direction, setDirection] = useState(true);
    const [total, setTotal] = useState(1);
    const [data, setData] = useState([]);
    const handleSearch = (value) => {
        setParams((prev) => ({ ...prev, pageNumber: 1, search: value }));
    };
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [openStateDropdown, setOpenStateDropdown] = useState(false);
    const handleClicked = (data) => {
        setIsModalOpen(true);
        setSelectedAssignment(data);
    };
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState({ pageNumber: 1 });
    const sorterLog = (name) => {
        setSortPos(false)
        setSortOrder("asc")
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
    const columns = [
        {
            title: (
                <span className="flex items-center justify-between">
                    No{" "}
                    {
                        sortPos && sortOrder === "desc" ? (
                            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
                        ) : (
                            <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                        )
                    }
                </span>
            ),
            dataIndex: "index",
            width: "6%",
            key: "index",
            render: (text, record, index) =>
                <span>
                    {sortOrder === "desc" && sortPos === true ? total - ((params?.pageNumber - 1) * 10) - index : index + 1 + ((params?.pageNumber - 1) * 10)}
                </span>,
            onHeaderCell: () => ({
                onClick: () => {
                    if (params.sortOrder === "asc") {
                        setParams({ ...params, sortOrder: "desc" })
                    }
                    else if (params.sortOrder === "desc") {
                        setParams({ ...params, sortOrder: "asc" })
                    }
                    else {
                        setParams({ ...params, sortOrder: "desc" })
                    }
                    
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    // if (sortOrder === "asc") {
                    //     setParams({ ...params, sortOrder: "desc" })
                    //     // setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    // }
                    // else if (sortOrder === "desc") {
                    //     setParams({ ...params, sortOrder: "asc" })
                    // }

                    setSortPos(true)
                },
            }),
        },
        {
            title: (
                <span className="flex items-center justify-between">
                    Asset Code{" "}
                    {params.sortBy === "AssetCode" ? (
                        params.sortOrder === "desc" ? (
                            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
                        ) : (
                            <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                        )
                    ) : (
                        <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                    )}
                </span>
            ),
            dataIndex: "assetCode",
            key: "name",
            ellipsis: true,
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
                        params.sortOrder === "desc" ? (
                            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
                        ) : (
                            <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                        )
                    ) : (
                        <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                    )}
                </span>
            ),
            dataIndex: "assetName",
            key: "name",
            ellipsis: true,
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
                    Assigned To{" "}
                    {params.sortBy === "AssignedTo" ? (
                        params.sortOrder === "desc" ? (
                            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
                        ) : (
                            <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                        )
                    ) : (
                        <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                    )}
                </span>
            ),
            dataIndex: "to",
            key: "assignedTo",
            ellipsis: true,
            onHeaderCell: () => ({
                onClick: () => {
                    sorterLog("AssignedTo");
                },
            }),
            render: (text) => <span>{text}</span>,
        },
        {
            title: (
                <span className="flex items-center justify-between">
                    Assigned By{" "}
                    {params.sortBy === "AssignedBy" ? (
                        params.sortOrder === "desc" ? (
                            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
                        ) : (
                            <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                        )
                    ) : (
                        <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                    )}
                </span>
            ),
            key: "assignedBy",
            dataIndex: "by",
            ellipsis: true,
            onHeaderCell: () => ({
                onClick: () => {
                    sorterLog("AssignedBy");
                },
            }),
            render: (text) => <span>{text}</span>,
        },
        {
            title: (
                <span className="flex items-center justify-between">
                    Assigned Date{" "}
                    {params.sortBy === "AssignedDate" ? (
                        params.sortOrder === "desc" ? (
                            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
                        ) : (
                            <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                        )
                    ) : (
                        <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                    )}
                </span>
            ),
            key: "assignedDate",
            dataIndex: "assignedDate",
            ellipsis: true,
            onHeaderCell: () => ({
                onClick: () => {
                    sorterLog("AssignedDate");
                },
            }),
            render: (text) => <span>{text.slice(0, 10)}</span>,
        },
        {
            title: (
                <span className="flex items-center justify-between">
                    State{" "}
                    {params.sortBy === "State" ? (
                        params.sortOrder === "desc" ? (
                            <CaretDownOutlined className="w-[20px] text-lg h-[20px]" />
                        ) : (
                            <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                        )
                    ) : (
                        <CaretUpOutlined className="w-[20px] text-lg h-[20px]" />
                    )}
                </span>
            ),
            key: "state",
            dataIndex: "state",
            ellipsis: true,
            onHeaderCell: () => ({
                onClick: () => {
                    sorterLog("State");
                },
            }),
            render: (text) => <span>{text}</span>,
        },
        {
            title: "",
            key: "action",
            width: "16%",
            ellipsis: true,
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small"
                        disabled={record?.state === "Accepted"}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("edit-asset");
                        }}
                    >
                        <EditFilled className="text-sm mb-1" />
                    </Button>
                    <Button size="small"
                        disabled={record?.state === "Accepted"}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("delete-asset");
                        }}
                    >
                        <CloseCircleOutlined className="text-red-600 text-sm mb-1" />
                    </Button>
                    <Button size="small"
                        disabled={record?.state === "Waiting for acceptance"}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("delete-asset");
                        }}
                    >
                        <RedoOutlined className="text-blue-600 text-sm mb-1" />
                    </Button>
                </Space>
            ),
        },
    ];
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



    // useEffect(() => {
    //     if (isModalOpen) {
    //         axiosInstance
    //             .get(`/Assets/${selectedAsset.id}`)
    //             .then((res) => {
    //                 if (res.data.success) {
    //                     setSelectedAsset(res.data.data);
    //                 } else {
    //                     message.error(res.data.message);
    //                 }
    //             })
    //             .catch((err) => {
    //                 message.error(err.message);
    //             });
    //     }
    // }, [isModalOpen]);

    return (
        <LayoutPage>
            <div className="w-full mt-10">
                <h1 className="font-bold text-d6001c text-2xl">Assignment List</h1>
                <div className="flex items-center justify-between mt-7 mb-2">
                    <Space.Compact>
                        <Select
                            open={openStateDropdown}
                            defaultValue={"State"}
                            suffixIcon={<FilterOutlined style={{ fontSize: "16px" }} onClick={() => setOpenStateDropdown(!openStateDropdown)} />}
                            className="w-[250px]"
                            onChange={(value) =>
                                setParams((prev) => ({ ...prev, state: value, pageNumber: 1 }))
                            }
                            onSelect={() => setOpenStateDropdown(!openStateDropdown)}
                            options={[
                                {
                                    value: "All",
                                    label: "All",
                                },
                                {
                                    value: "1",
                                    label: "Accepted",
                                },
                                {
                                    value: "2",
                                    label: "Waiting for acceptance",
                                },
                                {
                                    value: "3",
                                    label: "Declined",
                                },
                            ]}
                        />
                    </Space.Compact>
                    <Space.Compact>
                        <DatePicker className="w-[250px]" format="YYYY-MM-DD" placeholder="Assigned Date" onChange={(value) =>
                            setParams((prev) => ({ ...prev, pageNumber: 1, assignedDate: value?.format("YYYY-MM-DD") }))
                        } />
                    </Space.Compact>
                    <div className="flex gap-10">
                        <Space.Compact>
                            <Search
                                className="w-[300px]"
                                maxLength={100}
                                placeholder="Enter text"
                                value={searchQuery}
                                allowClear
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onSearch={() => {
                                    setSearchQuery(searchQuery.trim());
                                    handleSearch(removeExtraWhitespace(searchQuery));
                                }}
                            />
                        </Space.Compact>
                        <Button
                            className="flex items-center w-[200px] h-[32px] bg-d6001c"
                            type="primary"
                            size="large"
                            onClick={() => {
                                navigate("create-asset");
                            }}
                        >
                            Create new assignment
                        </Button>
                    </div>
                </div>
                <div className="justify-center items-center mt-0">
                    {console.log(data)}
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
                        className="mt-10"
                        columns={columns}
                        dataSource={data}
                        defaultPageSize={10}
                        onRow={(record) => {
                            return {
                                onDoubleClick: () => {
                                    handleClicked(record);
                                },
                            };
                        }}
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

                <Modal
                    title={
                        <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold">
                            Detailed Assignment Information
                        </h3>
                    }
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    className="custom-modal"
                >
                    <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
                        <div className="flex mb-[10px]">
                            <span className="font-bold w-[150px]">Asset Code:</span>
                            <span>{selectedAssignment?.assetCode}</span>
                        </div>
                        <div className="flex mb-[10px]">
                            <span className="font-bold w-[150px]">Time:</span>
                            <span>{selectedAssignment && formatDateTime(selectedAssignment?.assignedDate)}</span>
                        </div>
                        <div className="flex mb-[10px]">
                            <span className="font-bold w-[150px]">State:</span>
                            <span>{stateConvert(selectedAssignment?.status)}</span>
                        </div>
                        <div className="flex mb-[10px]">
                            <span className="font-bold w-[150px]">Assigned By: </span>
                            <span>{selectedAssignment?.by}</span>
                        </div>
                        <div className="flex mb-[10px]">
                            <span className="font-bold w-[150px]">Assigned To: </span>
                            <span>{selectedAssignment?.to}</span>
                        </div>
                        <div className="flex mb-[10px]">
                            <span className="font-bold w-[150px]">Assigned By: </span>
                            <span>{selectedAssignment?.by}</span>
                        </div>
                        <div className="flex mb-[10px]">
                            <span className="font-bold w-[150px]">Note: </span>
                            <span>{selectedAssignment?.note}</span>
                        </div>
                    </div>
                </Modal>
            </div>
        </LayoutPage>
    );
};

export default ManageAssignment;