import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { AuthContext } from "../contexts/AuthContext";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const EditAsset = () => {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm(); // Form for category modal
  const [assetName, setAssetName] = useState("");
  const [specification, setSpecification] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [data, setData] = useState([]);
  const { auth } = useContext(AuthContext);

  const adminId = auth?.user?.id;
  const navigate = useNavigate();
  const handleConfirm = () => {
    navigate("/manage-asset");
  };

  const onFinish = (values) => {
    setIsLoading(true);
    values.installDate = values.installDate.format("YYYY-MM-DD");
    var {categoryName,assetCode,...rest} = values
    console.log(rest);
    axiosInstance
      .put(`/assets/${params.id}`, rest)
      .then((response) => {
        if (response.data.success === true) {
          message.success("An asset is updated!");
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
      .get(`/assets/${params.id}`)
      .then((response) => {
        if (response.data.success === true) {
          setData(response.data.data)
          form.setFieldsValue({ 
            ...response.data.data, 
            installDate: response.data.data.installDate ? dayjs(response.data.data.installDate, "YYYY-MM-DD") : null, })
          setIsLoading(false);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        message.error("Get categories error occurred. Please try again.");
      });
  }, []);
  
  const onFieldsChange = () => {
    const fieldsError = form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length;
    // const allFieldsTouched = form.isFieldsTouched(true);

    setIsButtonDisabled(fieldsError > 0);
  };

  const handleBlur = (name) => (e) => {
    const trimmedValue = removeExtraWhitespace(e.target.value);
    if (name === "assetName") {
      setAssetName(trimmedValue);
      form.setFieldsValue({ assetName: trimmedValue });
    } else if (name === "specification") {
      setSpecification(trimmedValue);
      form.setFieldsValue({ specification: trimmedValue });
    }
    form.validateFields([name]);
  };

  return (
    <LayoutPage>
      <Spin spinning={isLoading} className="w-full">
        <div className="mt-[70px]">
          <h1 className="font-bold text-d6001c text-2xl">Edit Asset</h1>
          <Form
            className="mt-10 create-asset"
            onFinish={onFinish}
            form={form}
            onFieldsChange={onFieldsChange} 
          >
            <Form.Item
              className="asset-name-form-item"
              label="Asset Code"
              name="assetCode"
              disabled
              rules={[
                { required: true, message: "Please enter Asset Name!" },
                {
                  min: 2,
                  max: 100,
                  message:
                    "The length of Asset Name should be 2-100 characters!",
                },
                // { validator: validateName },
              ]}

              validateTrigger="onBlur"
            >
              <Input
                placeholder="Enter Asset name...."
                value={assetName}
                className="ms-[18px] w-96"
                onBlur={handleBlur("assetName")}
                disabled
              />
            </Form.Item>
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
                // { validator: validateName },
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
              name="categoryName"
              className="cate-form-item"
              rules={[{ required: true, message: "Please choose a category!" }]}
            >
              <Select
                className="ms-[30px]"
                style={{ width: `384px` }}
                disabled
              >
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
                // { validator: validateName },
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
                <Radio value={1} className="block">Not available</Radio>
                <Radio value={4} className="block">Waiting for recycling</Radio>
                <Radio value={5} className="block">Recycled</Radio>
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

export default EditAsset;
