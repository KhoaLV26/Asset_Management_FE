import React, { useContext, useState } from "react";
import { AuthContext, getUser } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { Button, Form, Input, message } from "antd";
import { removeAllWhitespace } from "../utils/helpers/HandleString";

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [form] = Form.useForm();

  const handleBlur = (e) => {
    const trimmedValue = removeAllWhitespace(e.target.value);
    form.setFieldsValue({ username: trimmedValue });
    form.validateFields(["username"]);
  };

  const validateName = (_, value) => {
    const trimmedValue = value.trim();
    if (!/^[a-zA-Z0-9]*$/.test(trimmedValue)) {
      return Promise.reject("Username must not contain symbols!");
    }
    return Promise.resolve();
  };

  const onFieldsChange = () => {
    const fieldsError = form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length;
    const allFieldsTouched = form.isFieldsTouched(true);

    setIsButtonDisabled(fieldsError > 0 || !allFieldsTouched);
  };

  const onFinish = async (values) => {
    if (getUser()) {
      return message.error("You are already logged in!");
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auths/login", values);
      login(response.data.data);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        message.error("Username or password is incorrect. Please try again");
      } else {
        message.error("Login failed! Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-d6001c font-bold text-center mb-6">
          Online Asset Management
        </h1>
        <h2 className="text-2xl mb-4 text-d6001c font-bold text-center">
          Login
        </h2>
        <Form
          onFinish={onFinish}
          layout="vertical"
          onFieldsChange={onFieldsChange}
          form={form}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please input your username!" },
              { validator: validateName },
            ]}
            validateTrigger="onBlur"
          >
            <Input onBlur={handleBlur} placeholder="Enter username...." />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
            validateTrigger="onBlur"
          >
            <Input.Password placeholder="Enter password...." />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-d6001c text-white font-bold"
              disabled={isButtonDisabled}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
