import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectModal from "../components/SelectModal";
import LayoutPage from "../layout/LayoutPage";
import "../styles/CreateAssignment.css"
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
    message,
    Button,
    Form
} from "antd";

//const { TextArea } = Input;
//const { Option } = Select;

const CreateAssignment = () => {
    const [userData, setUserData] = useState("");
    const [assetData, setAssetData] = useState("");
    // const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();
    const [userForm] = Form.useForm();
    const [assetForm] = Form.useForm();
    const [specification, setSpecification] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [viewModal, setViewModal] = useState(false); 

const adminId = "CFF14216-AC4D-4D5D-9222-C951287E51C6";
const navigate = useNavigate();

const handleCancel = () => {
    // setIsUserModalVisible(false);
    // setIsAssetModalVisible(false);
    // setNewUserName("");
    // setNewAssetName("");
    // setNewUserPrefix("");
    // setNewAssetPrefix("");
    // setIsAddUserButtonDisabled(true); // Disable button on cancel
    // setIsAddAssetButtonDisabled(true);
    // userForm.resetFields(); // Reset form fields when the modal is closed
    // assetForm.resetFields();
};

const handleConfirm = () => {
    navigate("/manage-assignment");
};

const onFinish = (values) => {
    // setIsLoading(true);
    values.assignedBy = adminId;
    values.createdBy = adminId;
    values.createdAt = values.createdAt.format("YYYY-MM-DD");
    axiosInstance
        .post("/assignments", values)
        .then((response) => {
            if (response.data.success === true) {
                message.success("An assignment is created!");
                navigate("/manage-assignment", {state: { data: response.data.data } });
            }
            else {
                message.error(response.data.message);
            }
        })
        .catch((error) => {
            if (error.response.status === 409) {
                message.error(error.response.data.message);
              } else message.error("Create asset error occurred. Please try again.");
        });
        // setIsLoading(false);
};

useEffect(() => {
    // setIsLoading(true);
    axiosInstance
        .get("/users")
        .then((response) =>{
            if (response.data.success === true) {
                const sortedUserData = response.data.data.sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            setUserData(sortedUserData);
            // setIsLoading(false);
            }
            else{
                message.error("Get users error occurred. Please try again.");
            }});
}, []);

const onFieldsChange = () => {
    const fieldsError = form
        .getFieldsError()
        .filler(({error}) => error.length).length;
    const allFieldsTouched = form.isFieldsTouched(true);
    setIsButtonDisabled(fieldsError > 0 || !allFieldsTouched);
};

return (
    <LayoutPage>
        {/* <Spin> */}
            <div className="mt-[70px]">
                <h1 className="font-bold text-d6001c text-2xl">Create New Assignment</h1>
                <Form
                    className="mt-10"
                    onFinish={onFinish}
                    form={form}
                    onFieldsChange={onFieldsChange}
                    initialValues={{ createBy: "defaultUser" }}
                >
                    <Form.Item
                        label ="User"
                        name ="userId"
                        rules ={[{required: true, message: "Please choose a user!"}]}
                        validateTrigger="onBlur"
                        className="user-form-item"
                    >
                        <Select
                            onClick={() => setViewModal(true)}
                        >
                        </Select>
                    </Form.Item>
                </Form>
                {viewModal && <SelectModal setisShowModal={setViewModal}/>}
            </div>
        {/* </Spin> */}
    </LayoutPage>
);
}
export default CreateAssignment;