import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectModal from "../components/SelectModal";
import LayoutPage from "../layout/LayoutPage";
import "../styles/CreateAssignment.css";
import moment from "moment";
import axiosInstance from "../axios/axiosInstance";
import dayjs from "dayjs";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import {
  Spin,
  message,
  Button,
  Form,
  Input,
  DatePicker,
  Popconfirm,
} from "antd";

const { TextArea, Search } = Input;

const CreateAssignment = () => {
  const [userId, setUserId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [userName, setUserName] = useState("");
  const [assetName, setAssetName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [viewModalUser, setViewModalUser] = useState(false);
  const [viewModalAsset, setViewModalAsset] = useState(false);
  const today = moment().format("YYYY-MM-DD");
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

  useEffect(() => {
    form.setFieldsValue({
      user: userName,
      asset: assetName,
    });
  }, [userName, assetName, form]);

  const onFinish = (values) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleConfirm = () => {
    navigate("/manage-user");
  };

  const onFieldsChange = () => {
    const errors = form.getFieldsError().filter(({ errors }) => errors.length);
    const fieldsWithError = errors.length;
    const allFieldsTouched = form.isFieldsTouched(true);
    setIsButtonDisabled(fieldsWithError > 0 || !allFieldsTouched);
  };

  return (
    <LayoutPage>
      <Spin spinning={isLoading} className="w-full">
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
                  min: 4,
                  max: 100,
                  message: "Please chose a valid user!",
                },
              ]}
              validateTrigger="onSearch"
            >
              <Search
                readOnly
                placeholder="Chose an user...."
                value={userName}
                className="w-full"
                onSearch={() => {
                  setViewModalUser(true);
                }}
              />
            </Form.Item>

            <Form.Item
              className="name-form-item"
              label="Asset"
              name="asset"
              rules={[
                { required: true, message: "Please chose an asset!" },
                {
                  min: 4,
                  max: 100,
                  message: "Please chose a valid asset!",
                },
              ]}
              validateTrigger={["onSearch", "onBlur", "onChange"]}
            >
              <Search
                readOnly
                placeholder="Chose an asset...."
                value={assetName}
                className="w-full"
                onSearch={() => {
                  setViewModalAsset(true);
                }}
              />
            </Form.Item>

            <Form.Item
              label="Assigned Date"
              name="assignedDate"
              required
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(
                        new Error("Please input the assigned date!")
                      );
                    }

                    const today = moment().startOf("day");
                    if (value.isBefore(today)) {
                      return Promise.reject(
                        new Error(
                          "Assigned date is not later than today's date."
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              validateTrigger={["onSearch", "onBlur", "onChange"]}
            >
              <DatePicker
                defaultValue={dayjs(today, "YYYY-MM-DD")}
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
                  message: "This field can only contain 255 characters",
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
          {viewModalUser && (
            <SelectModal
              setisShowModal={setViewModalUser}
              type={"Select User"}
              setName={setUserName}
              setId={setUserId}
              chosenId={userId}
            />
          )}
          {viewModalAsset && (
            <SelectModal
              setisShowModal={setViewModalAsset}
              type={"Select Asset"}
              setName={setAssetName}
              setId={setAssetId}
              chosenId={assetId}
            />
          )}
        </div>
      </Spin>
    </LayoutPage>
  );
};
export default CreateAssignment;
