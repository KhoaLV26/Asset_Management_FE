import React, { useState, useContext, useEffect } from "react";
import {
  Layout,
  Button,
  Dropdown,
  Menu,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  CaretDownFilled,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalizeWords } from "../utils/helpers/HandleString";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/Header.css";
import axiosInstance from "../axios/axiosInstance";
import Cookies from "js-cookie";

export const Header = () => {
  const { isAuthen, auth, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const pathNames =
    location.pathname.split("/").filter((x) => x).length !== 0
      ? location.pathname.split("/").filter((x) => x)
      : ["Home"];

  const breadcrumbLinks = pathNames.map((name, index) => {
    const path = `/${pathNames.slice(0, index + 1).join("/")}`;
    const displayName = capitalizeWords(name.replace(/-/g, " "));

    return (
      <span key={index}>
        {index > 0 && index < 2 && " > "}
        {index < 2 && (
          <a
            href={path}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = path;
            }}
          >
            {displayName}
          </a>
        )}
      </span>
    );
  });

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  useEffect(() => {
    if (isAuthen && auth?.user?.isFirstLogin) {
      setChangePasswordModalVisible(true);
    }
  }, [isAuthen, auth]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      setLogoutModalVisible(true);
    } else if (key === "change-password") {
      setChangePasswordModalVisible(true);
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="change-password" icon={<LockOutlined />}>
        Change Password
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout.Header
        style={{
          position: "fixed",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
        className="bg-d6001c px-10 flex items-center justify-between w-full"
      >
        <div className="flex items-center text-white font-extrabold">
          <span className="text-lg">{breadcrumbLinks}</span>
        </div>
        {isAuthen ? (
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Button
              icon={<UserOutlined />}
              className="flex items-center w-auto font-bold bg-d6001c text-white"
              size="large"
            >
              {auth?.user?.username}
              <CaretDownFilled />
            </Button>
          </Dropdown>
        ) : (
          <Button
            icon={<UserOutlined />}
            className="flex items-center w-[100px] font-bold bg-d6001c text-white"
            size="large"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </Layout.Header>

      <Modal
        title={<span className="change-password-title">Are you sure?</span>}
        open={isLogoutModalVisible}
        footer={null}
        closable={false}
      >
        <LogoutForm
          setLogoutModalVisible={setLogoutModalVisible}
          handleLogout={handleLogout}
        />
      </Modal>

      <Modal
        title={<span className="change-password-title">Change Password</span>}
        open={isChangePasswordModalVisible}
        closable={false}
        footer={null}
      >
        {changePasswordSuccess ? (
          <div className="pt-5 text-center">
            Your password has been changed successfully!
            <br />
            <Button
              className="ms-[250px] mt-5"
              onClick={() => {
                setChangePasswordSuccess(false);
                setChangePasswordModalVisible(false);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <ChangePasswordForm
            setChangePasswordModalVisible={setChangePasswordModalVisible}
            setChangePasswordSuccess={setChangePasswordSuccess}
          />
        )}
      </Modal>
    </>
  );
};

const LogoutForm = ({ setLogoutModalVisible, handleLogout }) => (
  <Form>
    <Form.Item className="px-5 pt-2">
      <p>Do you want to log out?</p>
    </Form.Item>
    <Form.Item className="ms-[18px]">
      <Button className="bg-red-600 text-white border-1" onClick={handleLogout}>
        Log out
      </Button>

      <Button
        onClick={() => setLogoutModalVisible(false)}
        className="ms-[10px]"
      >
        Cancel
      </Button>
    </Form.Item>
  </Form>
);

const ChangePasswordForm = ({
  setChangePasswordModalVisible,
  setChangePasswordSuccess,
}) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const validatePassword = (_, value) => {
    const oldPassword = form.getFieldValue("oldPassword");
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    }
    if (value.length < 8) {
      return Promise.reject(
        new Error("Password must be at least 8 characters long.")
      );
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(
        new Error("Password must include at least one uppercase letter.")
      );
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(
        new Error("Password must include at least one lowercase letter.")
      );
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(
        new Error("Password must include at least one digit.")
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject(
        new Error("Password must include at least one special character.")
      );
    }
    if (/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject(new Error("Password contains invalid characters."));
    }
    if (value === oldPassword && auth?.user?.isFirstLogin === false) {
      return Promise.reject(
        new Error("New password must be different from the old password.")
      );
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please confirm your password!"));
    }
    if (value !== form.getFieldValue("newPassword")) {
      return Promise.reject(
        new Error("Confirm password does not match new password.")
      );
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

  const handleFinish = async (values) => {
    const username = auth?.user?.username;
    values.username = username;
    values.password = values.newPassword;
    values.refreshToken = auth.refreshToken;
    setLoading(true);
    try {
      if (!auth?.user?.isFirstLogin) {
        await axiosInstance.post("/auths/change-password", values);
      } else {
        await axiosInstance.post("/auths/reset-password", values);
        setAuth({ ...auth, user: { ...auth.user, isFirstLogin: false } });
        Cookies.remove("user");
        Cookies.set(
          "user",
          JSON.stringify({ ...auth.user, isFirstLogin: false }),
          { expires: 7 }
        );
      }
      setChangePasswordSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        form.setFields([
          {
            name: "oldPassword",
            errors: [error.response.data.message],
          },
        ]);
      } else {
        message.error("An error occurred, please try again.");
      }
    }
    setLoading(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setChangePasswordModalVisible(false);
  };

  return (
    <Form form={form} onFieldsChange={onFieldsChange} onFinish={handleFinish}>
      {auth?.user?.isFirstLogin ? (
        <p className="px-5 pt-4 pb-3">
          This is the first time you logged in.
          <br />
          You have to change your password to continue
        </p>
      ) : (
        <Form.Item
          className="px-5 pt-5 old-password-form-item"
          name="oldPassword"
          label="Old Password"
          rules={[
            { required: true, message: "Please input your old password!" },
          ]}
          validateTrigger="onBlur"
        >
          <Input.Password
            className="ms-[28px] w-[298px]"
            placeholder="Enter old password..."
          />
        </Form.Item>
      )}

      <Form.Item
        className="px-5 new-password-form-item"
        name="newPassword"
        label="New Password"
        rules={[{ required: true, validator: validatePassword }]}
        validateTrigger="onBlur"
      >
        <Input.Password
          className="ms-[21px] w-[299px]"
          placeholder="Enter new password..."
        />
      </Form.Item>
      <Form.Item
        className="px-5"
        name="confirmPassword"
        label="Confirm Password"
        rules={[{ required: true, validator: validateConfirmPassword }]}
        validateTrigger="onBlur"
      >
        <Input.Password
          className="w-[297px]"
          placeholder="Enter confirm password..."
        />
      </Form.Item>
      <Form.Item
        className={auth?.user?.isFirstLogin ? "px-5 ms-[360px]" : "ms-[280px]"}
      >
        <Button
          type="primary"
          htmlType="submit"
          disabled={isButtonDisabled}
          className="bg-red-600 text-white border-1"
          loading={loading}
          style={{ marginLeft: "10px", width: "75px" }}
        >
          Save
        </Button>
        {!auth?.user?.isFirstLogin && (
          <Button onClick={handleCancel} className="ms-[20px] w-[75px]">
            Cancel
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default Header;
