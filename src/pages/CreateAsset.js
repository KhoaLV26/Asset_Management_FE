import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../layout/LayoutPage";
import {
  Button,
  DatePicker,
  Input,
  Popconfirm,
  Radio,
  Select,
  Spin,
  message,
  Form,
  Modal,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "../styles/CreateAsset.css";
import axiosInstance from "../axios/axiosInstance";
import { removeExtraWhitespace } from "../utils/helpers/HandleString";

const { TextArea } = Input;
const { Option } = Select;

const CreateAsset = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm(); // Form for category modal
  const [assetName, setAssetName] = useState("");
  const [specification, setSpecification] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPrefix, setNewCategoryPrefix] = useState("");
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);
  const [isAddCategoryButtonDisabled, setIsAddCategoryButtonDisabled] =
    useState(true); // New state for category button

  const adminId = "CFF14216-AC4D-4D5D-9222-C951287E51C6";
  const navigate = useNavigate();

  const handleCancel = () => {
    setIsCategoryModalVisible(false);
    setNewCategoryName("");
    setNewCategoryPrefix("");
    setIsAddCategoryButtonDisabled(true); // Disable button on cancel
    categoryForm.resetFields(); // Reset form fields when the modal is closed
  };

  const handleConfirm = () => {
    navigate("/manage-asset");
  };

  const onFinish = (values) => {
    setIsLoading(true);
    values.createdBy = adminId;
    values.installDate = values.installDate.format("YYYY-MM-DD");
    axiosInstance
      .post("/assets", values)
      .then((response) => {
        if (response.data.success === true) {
          message.success("An asset is created!");
          navigate("/manage-asset", { state: { data: response.data.data } });
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

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get("/categories")
      .then((response) => {
        if (response.data.success === true) {
          const sortedCategoryData = response.data.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setCategoryData(sortedCategoryData);
          setIsLoading(false);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        message.error("Get categories error occurred. Please try again.");
      });
  }, []);

  const validateName = (_, value) => {
    const trimmedValue = value.trim(); // Trim whitespace from the input
    if (/[^a-zA-Z\s]/.test(trimmedValue)) {
      return Promise.reject(
        new Error("Name must not contain symbols or numbers.")
      );
    }
    return Promise.resolve();
  };

  const validateCategoryName = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter Category Name!"));
    }
    const trimmedValue = value.trim();
    if (trimmedValue.length < 2 || trimmedValue.length > 100) {
      return Promise.reject(
        new Error("The length of Category should be 2-100 characters!")
      );
    }
    if (/[^a-zA-Z\s]/.test(trimmedValue)) {
      return Promise.reject(
        new Error("Category name must not contain symbols or numbers.")
      );
    }
    const isCategoryExist = categoryData.some(
      (category) => category.name.toLowerCase() === trimmedValue.toLowerCase()
    );
    if (isCategoryExist) {
      return Promise.reject(
        new Error(
          "Category is already existed. Please enter a different category."
        )
      );
    }
    return Promise.resolve();
  };

  const validateCategoryPrefix = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter Prefix!"));
    }
    const trimmedValue = value.trim();
    if (trimmedValue.length !== 2 || !/^[A-Z]+$/.test(trimmedValue)) {
      return Promise.reject(
        new Error("The prefix should contain 2 uppercase characters!")
      );
    }
    const isPrefixExist = categoryData.some(
      (category) => category.code.toLowerCase() === trimmedValue.toLowerCase()
    );
    if (isPrefixExist) {
      return Promise.reject(
        new Error("Prefix is already existed. Please enter a different prefix.")
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

  const onCategoryFieldsChange = () => {
    const fieldsError = categoryForm
      .getFieldsError()
      .filter(({ errors }) => errors.length).length;
    const allFieldsTouched = categoryForm.isFieldsTouched(true);

    setIsAddCategoryButtonDisabled(fieldsError > 0 || !allFieldsTouched);
  };

  const handleBlur = (name) => (e) => {
    const trimmedValue = removeExtraWhitespace(e.target.value);
    if (name === "assetName") {
      setAssetName(trimmedValue);
      form.setFieldsValue({ assetName: trimmedValue });
    } else if (name === "specification") {
      setSpecification(trimmedValue);
      form.setFieldsValue({ specification: trimmedValue });
    } else if (name === "newCategoryName") {
      setNewCategoryName(trimmedValue);
      categoryForm.setFieldsValue({ categoryName: trimmedValue });
    } else if (name === "newCategoryPrefix") {
      setNewCategoryPrefix(trimmedValue.replace(/\s/g, ""));
      categoryForm.setFieldsValue({ prefix: trimmedValue.replace(/\s/g, "") });
    }
    form.validateFields([name]);
  };

  const showModal = () => {
    setIsCategoryModalVisible(true);
    setNewCategoryName("");
    setNewCategoryPrefix("");
    setIsAddCategoryButtonDisabled(true); // Reset button state on modal open
    categoryForm.resetFields(); // Reset form fields when the modal is opened
  };

  const handleAddCategory = () => {
    categoryForm.validateFields().then((values) => {
      const newCategory = {
        createdBy: adminId,
        name: values.categoryName,
        code: values.prefix,
      };

      setIsLoading(true);

      axiosInstance
        .post("/categories", newCategory)
        .then((response) => {
          if (response.data.success) {
            setCategoryData([response.data.data, ...categoryData]);
            message.success("A category is created!");
          } else {
            message.error(response.data.message);
          }
        })
        .catch((error) => {
          message.error("Add category error occurred. Please try again.");
        });

      setIsLoading(false);

      setIsCategoryModalVisible(false);
      setNewCategoryName("");
      setNewCategoryPrefix("");
      categoryForm.resetFields(); // Reset form fields after submission
    });
  };

  const handleCategoryNameChange = (e) => {
    const value = e.target.value;
    const prefix = value.slice(0, 2).toUpperCase();
    setNewCategoryName(value);
    setNewCategoryPrefix(prefix);
    categoryForm.setFieldsValue({ prefix: prefix });
    categoryForm.validateFields(["prefix"]);
  };

  return (
    <LayoutPage>
      <Spin spinning={isLoading} className="w-full">
        <div className="mt-[70px]">
          <h1 className="font-bold text-d6001c text-2xl">Create New Asset</h1>
          <Form
            className="mt-10 create-asset"
            onFinish={onFinish}
            form={form}
            onFieldsChange={onFieldsChange}
            initialValues={{ createBy: "defaultUser" }}
          >
            <Form.Item
              className="asset-name-form-item"
              label="Name"
              name="assetName"
              rules={[
                { required: true, message: "Please enter Asset Name!" },
                {
                  min: 2,
                  max: 100,
                  message:
                    "The length of Asset Name should be 2-100 characters!",
                },
                { validator: validateName },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                placeholder="Enter Asset name...."
                value={assetName}
                className="ms-[50px] w-96"
                onBlur={handleBlur("assetName")}
              />
            </Form.Item>

            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: "Please choose a category!" }]}
              validateTrigger="onBlur"
              className="cate-form-item"
            >
              <Select
                className="ms-[30px]"
                style={{ width: `384px` }}
                onClick={() => setIsDropdownClicked(true)}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Button
                      type="dashed"
                      style={{ width: "100%", marginTop: "8px" }}
                      onClick={showModal}
                    >
                      Add new category
                    </Button>
                  </>
                )}
              >
                {categoryData.map((cate) => (
                  <Option key={cate.id} value={cate.id}>
                    {cate.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              className="spe-form-item"
              label="Specification"
              name="specification"
              rules={[
                { required: true, message: "Please enter Specification!" },
                {
                  min: 2,
                  max: 255,
                  message:
                    "The length of Specification should be 2-255 characters!",
                },
                { validator: validateName },
              ]}
              validateTrigger="onBlur"
            >
              <TextArea
                placeholder="Enter text...."
                value={specification}
                className="ms-[7px] w-96"
                rows={3}
                onBlur={handleBlur("specification")}
              />
            </Form.Item>

            <Form.Item
              label="Installed Date"
              name="installDate"
              required
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error("Please choose a Date!"));
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
              label="State"
              name="status"
              rules={[{ required: true, message: "Please choose a State!" }]}
              className="form-item"
            >
              <Radio.Group className="ms-[52px] custom-radio-group">
                <Radio value={2} className="block">
                  Available
                </Radio>
                <Radio value={1}>Not available</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item className="">
              <Button
                type="primary"
                htmlType="submit"
                disabled={isButtonDisabled}
                className=" me-5 bg-red-600"
                style={{ marginLeft: `340px` }}
                loading={isLoading}
              >
                Save
              </Button>
              <Popconfirm
                title="Cancel creating asset?"
                description="Are you sure you want to cancel creating the new asset?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Cancel</Button>
              </Popconfirm>
            </Form.Item>
          </Form>
        </div>
        <Modal
          title="Add New Category"
          visible={isCategoryModalVisible}
          closable={false}
          footer={[
            <Popconfirm
              title="Cancel creating new category?"
              description="Are you sure you want to cancel creating the new category?"
              onConfirm={handleCancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                key="ok"
                icon={<CloseOutlined />}
                className="bg-white text-red-600 border-red-500 border-1"
              />
            </Popconfirm>,

            <Button
              key="ok"
              onClick={handleAddCategory}
              disabled={isAddCategoryButtonDisabled}
              icon={<CheckOutlined />}
              className="bg-white text-green-600 border-green-500 border-1"
            />,
          ]}
        >
          <Form
            layout="vertical"
            form={categoryForm}
            onFieldsChange={onCategoryFieldsChange}
          >
            <Form.Item
              label="Category Name"
              name="categoryName"
              rules={[
                { required: true, message: "" },
                { validator: validateCategoryName },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                value={newCategoryName}
                onChange={handleCategoryNameChange}
                placeholder="Enter Category name..."
                onBlur={handleBlur("newCategoryName")}
              />
            </Form.Item>
            <Form.Item
              label="Prefix"
              name="prefix"
              rules={[
                { required: true, message: "" },
                { validator: validateCategoryPrefix },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                value={newCategoryPrefix}
                onChange={(e) => setNewCategoryPrefix(e.target.value)}
                placeholder="Enter prefix for category code"
                onBlur={handleBlur("newCategoryPrefix")}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </LayoutPage>
  );
};

export default CreateAsset;
