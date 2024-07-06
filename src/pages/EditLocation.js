import React, { useEffect, useState } from "react";
import LayoutPage from "../layout/LayoutPage";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Spin,
  message,
} from "antd";
import "../styles/CreateUser.css";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const EditLocation = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationCode, setLocationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onValuesChange = (changedValues, allValues) => {};

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`/locations/${params.id}`)
      .then((response) => {
        if (response.data.success === true) {
          form.setFieldsValue({
            ...response.data.data,
          });
          setIsLoading(false);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        message.error("Error loading user");
      });
  }, []);

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
    axiosInstance
      .put(`/locations/${params.id}`, values)
      .then((response) => {
        if (response.data.success === true) {
          message.success("Location updated successfully!");
          navigate("/manage-location", { state: { data: response.data.data } });
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          message.error(error.response.data.message);
        } else
          message.error("Update location error occurred. Please try again.");
      });
    setIsLoading(false);
  };

  const onFieldsChange = () => {
    const fieldsError = form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length;
    setIsButtonDisabled(fieldsError > 0);
  };

  const handleBlur = (name) => (e) => {
    let trimmedValue = removeExtraWhitespace(e.target.value);
    if (name === "locationName") {
      setLocationName(trimmedValue);
      form.setFieldsValue({ name: trimmedValue });
    } else if (name === "locationCode") {
      trimmedValue = trimmedValue.toUpperCase();
      setLocationCode(trimmedValue);
      form.setFieldsValue({ code: trimmedValue });
    }
    form.validateFields([name]);
  };

  const handleConfirm = () => {
    navigate("/manage-user");
  };

  return (
    <LayoutPage>
      <Spin spinning={isLoading} className="w-full">
        <div className="mt-[70px]">
          <h1 className="font-bold text-d6001c text-2xl">Edit Location</h1>
          <Form
            className="mt-10 max-w-[500px]"
            onFinish={onFinish}
            form={form}
            onFieldsChange={onFieldsChange}
            initialValues={{ createBy: "defaultUser" }}
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
                value={locationName}
                className="ms-2 w-96"
                onBlur={handleBlur("locationName")}
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
                value={locationCode}
                className="ms-3 w-96"
                onBlur={handleBlur("locationCode")}
              />
            </Form.Item>

            <Form.Item className="">
              <Button
                type="primary"
                htmlType="submit"
                disabled={isButtonDisabled}
                className=" me-5 bg-red-600"
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
    </LayoutPage>
  );
};

export default EditLocation;
