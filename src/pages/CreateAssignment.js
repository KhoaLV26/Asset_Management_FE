import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../layout/LayoutPage";
import axiosInstance from "../axios/axiosInstance";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import {
    Option,
    TextArea,
    Modal,
    Radio,
    Select,
    Spin,
} from "antd"

const { TextArea } = Input;
const { Option } = Select;

const CreateAssignment = () => {
    const [userData, setUserData] = useState;
    const [assetData, setAssetData] = useState;
    const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();
    const [userForm] = Form.useForm();
    const [assetForm] = Form.useForm();
    const [specification, setSpecification] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
}
const adminId = "CFF14216-AC4D-4D5D-9222-C951287E51C6";
const navigate = useNavigate();

const handleCancel = () => {
    setIsUserModalVisible(false);
    setIsAssetModalVisible(false);
    setNewUserName("");
    setNewAssetName("");
    setNewUserPrefix("");
    setNewAssetPrefix("");
    setIsAddUserButtonDisabled(true); // Disable button on cancel
    setIsAddAssetButtonDisabled(true);
    userForm.resetFields(); // Reset form fields when the modal is closed
    assetForm.resetFields();
};

const handleConfirm = () => {
    navigate("/manage-assignment");
};
