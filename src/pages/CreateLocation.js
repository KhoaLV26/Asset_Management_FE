import React, { useContext, useState } from "react";
import LayoutPage from "../layout/LayoutPage";
import { Button, Form, Input, Spin, message, Modal } from "antd";
import "../styles/CreateUser.css";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const CreateLocation = () => {
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const { auth } = useContext(AuthContext);

  const adminId = auth?.user?.id;
  const navigate = useNavigate();

  const validateName = (_, value) => {
    const trimmedValue = value.trim();
    if (/[^a-zA-Z\s]/.test(trimmedValue)) {
      return Promise.reject(
        new Error("Value must not contain symbols or numbers.")
      );
    }
    return Promise.resolve();
  };

  const onFinish = (values) => {
    setIsLoading(true);
    values.createBy = adminId;
    axiosInstance
      .post("/locations", values)
      .then((response) => {
        if (response.data.success) {
          message.success("Locations created successfully!");
          setResponseData(response.data.data);
          setIsModalVisible(true);
        } else {
          message.error(response.data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 409) {
          message.error(error.response.data.message);
        } else {
          message.error("Create location error occurred. Please try again.");
        }
        setIsLoading(false);
      });
  };

  const onFieldsChange = () => {
    const fieldsError = form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length;
    const allFieldsTouched = form.isFieldsTouched(true);
    setIsButtonDisabled(fieldsError > 0 || !allFieldsTouched);
  };

  const handleBlur = (name) => (e) => {
    let trimmedValue = removeExtraWhitespace(e.target.value);
    if (name === "name") {
      form.setFieldsValue({ name: trimmedValue });
    } else if (name === "code") {
      trimmedValue = trimmedValue.toUpperCase();
      form.setFieldsValue({ code: trimmedValue });
    }
    form.validateFields([name]);
  };

  const handleConfirm = () => {
    navigate("/manage-location");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigate("/manage-location", { state: { data: responseData } });
  };

  return (
    <LayoutPage>
      <Spin spinning={isLoading} className="w-full">
        <div className="mt-[70px]">
          <h1 className="font-bold text-d6001c text-2xl">
            Create New Location
          </h1>
          <Form
            className="mt-10"
            onFinish={onFinish}
            form={form}
            onFieldsChange={onFieldsChange}
          >
            <Form.Item
              className="name-form-item"
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input location name!" },
                {
                  min: 2,
                  max: 50,
                  message: "Location name must be between 2 and 50 characters!",
                },
                { validator: validateName },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                placeholder="Enter location name...."
                onBlur={handleBlur("name")}
                className="ms-2 w-96"
              />
            </Form.Item>

            <Form.Item
              className="name-form-item"
              label="Code"
              name="code"
              rules={[
                { required: true, message: "Please input location code!" },
                {
                  min: 2,
                  max: 2,
                  message: "Location code must be 2 upper case characters!",
                },
                { validator: validateName },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                placeholder="Enter location code...."
                onBlur={handleBlur("code")}
                className="ms-3 w-96"
              />
            </Form.Item>

            <Form.Item className="">
              <Button
                type="primary"
                htmlType="submit"
                disabled={isButtonDisabled}
                className="me-5 bg-red-600"
                style={{ marginLeft: `300px` }}
                loading={isLoading}
              >
                Save
              </Button>

              <Button onClick={handleConfirm} danger>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
      <Modal
        title="Admin Information"
        visible={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="submit" type="primary" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        <p>User Name: {responseData?.userName}</p>
        <p>Password: {responseData?.password}</p>
      </Modal>
    </LayoutPage>
  );
};

export default CreateLocation;
