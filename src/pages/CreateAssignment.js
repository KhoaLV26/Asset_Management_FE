import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectModal from "../components/SelectModal";
import LayoutPage from "../layout/LayoutPage";
import "../styles/CreateAssignment.css";
import axiosInstance from "../axios/axiosInstance";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import {
  Option,
  Modal,
  Radio,
  Select,
  Spin,
  message,
  Button,
  Form,
  Input,
  DatePicker,
  Popconfirm,
} from "antd";

const { TextArea } = Input;
//const { Option } = Select;

const CreateAssignment = () => {
  const [userId, setUserId] = useState("");
  const [assetId, setAssetId] = useState("");
  // const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [params, setParams] = useState({
    userId: "",
    assetId: "",
    assignedDate: "",
    note: "",
  });

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
          navigate("/manage-assignment", {
            state: { data: response.data.data },
          });
        } else {
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

  const handleBlur = () => (e) => {
    const trimmedValue = removeExtraWhitespace(e.target.value);
    form.setFieldsValue({ note: trimmedValue }); // Update form field value
    form.validateFields("name"); // Trigger validation on blur
  };

  const handleConfirm = () => {
    navigate("/manage-user");
  };

  useEffect(() => {
    // // setIsLoading(true);
    // axiosInstance
    //     .get("/users")
    //     .then((response) =>{
    //         if (response.data.success === true) {
    //             const sortedUserData = response.data.data.sort((a, b) =>
    //             a.name.localeCompare(b.name)
    //         );
    //         setUserData(sortedUserData);
    // setIsLoading(false);
    //         }
    //         else{
    //             message.error("Get users error occurred. Please try again.");
    //         }});
  }, []);

  const onFieldsChange = () => {
    // const fieldsError = form
    //   .getFieldsError()
    //   .filler(({ error }) => error.length).length;
    // const allFieldsTouched = form.isFieldsTouched(true);
    // setIsButtonDisabled(fieldsError > 0 || !allFieldsTouched);
    const errors = form.getFieldsError().filter(({ errors }) => errors.length);
    const fieldsWithError = errors.length;
    const allFieldsTouched = form.isFieldsTouched(true);

    setIsButtonDisabled(fieldsWithError > 0 || !allFieldsTouched);
  };

  return (
    <LayoutPage>
      {/* <Spin> */}
      <div className="mt-[70px] w-full flex">
        <h1 className="font-bold text-d6001c text-2xl">
          Create New Assignment
        </h1>
        <Form
          className="mt-20 w-2/5"
          onFinish={onFinish}
          form={form}
          onFieldsChange={onFieldsChange}
          initialValues={{ createBy: "defaultUser" }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            className="name-form-item"
            label="User:"
            name="user"
            rules={[
              { required: true, message: "Please chose an user!" },
              {
                min: 6,
                max: 6,
                message: "Please chose a valid user!",
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input
              placeholder="Enter your first name...."
              value={params.userId}
              className="w-full"
              //onBlur={handleBlur("firstName")}
            />
          </Form.Item>

          <Form.Item
            className="name-form-item"
            label="Asset"
            name="asset"
            rules={[
              { required: true, message: "Please chose an asset!" },
              {
                min: 6,
                max: 6,
                message: "Please chose a valid asset!",
              },
              //{ validator: validateName },
            ]}
            validateTrigger="onBlur"
          >
            <Input
              value={params.assetId}
              className="w-full"
              //onBlur={handleBlur("lastName")}
            />
          </Form.Item>

          <Form.Item
            label="Assigned Date"
            name="assignedDate"
            required
            rules={[]}
            validateTrigger="onBlur"
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              inputReadOnly
              allowClear={false}
            />
          </Form.Item>

          <Form.Item
            className="name-form-item"
            label="Note"
            name="note"
            rules={[
              {
                min: 0,
                max: 255,
                message: "abcxyz",
              },
            ]}
            validateTrigger="onBlur"
          >
            <TextArea
              showCount
              maxLength={255}
              //onChange={onChange}
              placeholder="Note...."
              className="w-full"
              style={{ height: 120, resize: "none" }}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item className="gap-4 mx-[45%] items-center justify-center w-full">
            <Button
              type="primary"
              htmlType="submit"
              disabled={isButtonDisabled}
              className=" me-5 bg-red-600"
              //loading={isLoading}
            >
              Save
            </Button>
            <Popconfirm
              title="Cancel creating user?"
              description="Are you sure you want to cancel creating user"
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Cancel</Button>
            </Popconfirm>
          </Form.Item>
        </Form>
        {viewModal && <SelectModal setisShowModal={setViewModal} />}
      </div>
      {/* </Spin> */}
    </LayoutPage>
  );
};
export default CreateAssignment;
