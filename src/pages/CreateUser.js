import React, { useContext, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
const { Option } = Select;

const CreateUser = () => {
  const [roleData, setRoleData] = useState([]);
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  const adminId = auth?.user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get("/roles")
      .then((response) => {
        if (response.data.success === true) {
          setRoleData(response.data.data);
          setIsLoading(false);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        message.error("Get roles error occurred. Please try again.");
      });
  }, []);

  const validateName = (_, value) => {
    const trimmedValue = value.trim();
    if (/[^a-zA-Z\s]/.test(trimmedValue)) {
      return Promise.reject(
        new Error("Name must not contain symbols or numbers.")
      );
    }
    return Promise.resolve();
  };

  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.dateOfBirth || changedValues.dateJoined) {
      form.validateFields(["dateJoined"]);
    }
  };

  const onFinish = (values) => {
    setIsLoading(true);
    values.createBy = adminId;
    values.dateOfBirth = values.dateOfBirth.format("YYYY-MM-DD");
    values.dateJoined = values.dateJoined.format("YYYY-MM-DD");
    axiosInstance
      .post("/users", values)
      .then((response) => {
        if (response.data.success === true) {
          message.success("User created successfully!");
          navigate("/manage-user", { state: { data: response.data.data } });
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          message.error(error.response.data.message);
        } else message.error("Create user error occurred. Please try again.");
      });
    setIsLoading(false);
  };

  const onFieldsChange = () => {
    const fieldsError = form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length;
    const allFieldsTouched = form.isFieldsTouched(true);

    setIsButtonDisabled(fieldsError > 0 || !allFieldsTouched);
  };

  const handleBlur = (name) => (e) => {
    const trimmedValue = removeExtraWhitespace(e.target.value);
    if (name === "firstName") {
      setFirstName(trimmedValue);
      form.setFieldsValue({ firstName: trimmedValue });
    } else if (name === "lastName") {
      setLastName(trimmedValue);
      form.setFieldsValue({ lastName: trimmedValue });
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
          <h1 className="font-bold text-d6001c text-2xl">Create New User</h1>
          <Form
            className="mt-10"
            onFinish={onFinish}
            form={form}
            onFieldsChange={onFieldsChange}
            initialValues={{ createBy: "defaultUser" }}
            onValuesChange={onValuesChange}
          >
            <Form.Item
              className="name-form-item"
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
                {
                  min: 2,
                  max: 50,
                  message: "First name must be between 2 and 50 characters!",
                },
                { validator: validateName },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                placeholder="Enter your first name...."
                value={firstName}
                className="ms-3 w-96"
                onBlur={handleBlur("firstName")}
              />
            </Form.Item>

            <Form.Item
              className="name-form-item"
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
                {
                  min: 2,
                  max: 50,
                  message: "Last name must be between 2 and 50 characters!",
                },
                { validator: validateName },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                placeholder="Enter your last name...."
                value={lastName}
                className="ms-3 w-96"
                onBlur={handleBlur("lastName")}
              />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              required
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(
                        new Error("Please input the date of birth!")
                      );
                    }
                    const currentDate = new Date();
                    const birthDate = new Date(value);

                    let age =
                      currentDate.getFullYear() - birthDate.getFullYear();

                    const monthDiff =
                      currentDate.getMonth() - birthDate.getMonth();
                    const dayDiff = currentDate.getDate() - birthDate.getDate();

                    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                      age--;
                    }

                    if (age < 18) {
                      return Promise.reject(
                        new Error(
                          "User is under 18. Please select a different date."
                        )
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
              validateTrigger="onBlur"
            >
              <DatePicker
                format="YYYY-MM-DD"
                className="w-96"
                inputReadOnly
                allowClear={false}
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
              className="form-item"
            >
              <Radio.Group className="ms-7 custom-radio-group">
                <Radio value={2}>Female</Radio>
                <Radio value={1}>Male</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              className="joinedDate-form-item"
              label="Joined Date"
              name="dateJoined"
              required
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(
                        new Error("Please input the joined date!")
                      );
                    }

                    const dob = getFieldValue("dateOfBirth");
                    if (dob && value.isBefore(dob)) {
                      return Promise.reject(
                        new Error(
                          "Joined date is not later than Date of Birth. Please select a different date."
                        )
                      );
                    }

                    const day = value.day();
                    if (day === 0 || day === 6) {
                      return Promise.reject(
                        new Error(
                          "Joined date is Saturday or Sunday. Please select a different date."
                        )
                      );
                    }

                    if (dob && value.isBefore(dob.clone().add(18, "years"))) {
                      return Promise.reject(
                        new Error(
                          "Joined date must be at least 18 years after the Date of Birth.\nPlease select a different date."
                        )
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
              validateTrigger="onBlur"
            >
              <DatePicker
                className="ms-1 w-96"
                format="YYYY-MM-DD"
                inputReadOnly
                allowClear={false}
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="roleId"
              rules={[{ required: true, message: "Please select a role!" }]}
              validateTrigger="onBlur"
              className="role-form-item"
            >
              <Select className="ms-12" style={{ width: `384px` }}>
                {roleData.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className="">
              <Button
                type="primary"
                htmlType="submit"
                disabled={isButtonDisabled}
                className=" me-5 bg-red-600"
                style={{ marginLeft: `330px` }}
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

export default CreateUser;
