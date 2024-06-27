import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectModal from "../components/SelectModal";
import LayoutPage from "../layout/LayoutPage";
import "../styles/CreateAssignment.css";
import moment from "moment";
import axiosInstance from "../axios/axiosInstance";
import dayjs from "dayjs";
import { Spin, message, Button, Form, Input, DatePicker } from "antd";
import { AuthContext } from "../contexts/AuthContext";

const { TextArea, Search } = Input;

const CreateAssignment = () => {
  const [staffCode, setStaffCode] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [userId, setUserId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [userName, setUserName] = useState("");
  const [assetName, setAssetName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [viewModalUser, setViewModalUser] = useState(false);
  const [viewModalAsset, setViewModalAsset] = useState(false);
  const [today, setToday] = useState(moment().format("YYYY-MM-DD"));
  const [note, setNote] = useState("");
  const [joinedDate, setJoinedDate] = useState(moment().format("YYYY-MM-DD"));
  const { auth } = useContext(AuthContext);

  const adminId = auth?.user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({
      user: userName,
      asset: assetName,
      assignedDate: dayjs(today, "YYYY-MM-DD"),
    });
    form.validateFields(["assignedDate"]);
  }, [userName, assetName, form]);

  const onFinish = (values) => {
    setIsLoading(true);
    axiosInstance
      .post("/assignments", {
        assignedTo: userId,
        assignedBy: adminId,
        assignedDate: today,
        assetId: assetId,
        note: note.trim(),
        status: 1,
      })
      .then((response) => {
        if (response.data.success === true) {
          message.success("An assignment is created!");
          axiosInstance.put(`/assets/${assetId}`, {
            status: 3,
          });

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
        } else
          message.error("Create assignment error occurred. Please try again.");
      });
    setIsLoading(false);
  };

  const onFieldsChange = () => {
    const fieldsError = form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length;

    setIsButtonDisabled(fieldsError > 0 || userName === "" || assetName === "");
  };

  return (
    <LayoutPage>
      <Spin spinning={isLoading} className="w-full">
        <div className="mt-[70px] w-full  justify-center items-center m-[34%]">
          <h1 className="font-bold text-d6001c text-2xl">
            Create New Assignment
          </h1>
          <Form
            className="mt-10"
            onFinish={onFinish}
            form={form}
            onFieldsChange={onFieldsChange}
            initialValues={{ assignedDate: dayjs(today, "YYYY-MM-DD") }}
          >
            <Form.Item
              className="choose-user-form-item"
              label="User:"
              name="user"
              rules={[{ required: true, message: "Please choose an user!" }]}
              validateTrigger={["onSearch", "onBlur", "onChange"]}
            >
              <Search
                readOnly
                placeholder="Choose an user...."
                value={userName}
                className="w-[400px] ml-20"
                onClick={() => {
                  setViewModalUser(true);
                }}
                onSearch={() => {
                  setViewModalUser(true);
                }}
              />
            </Form.Item>
            <Form.Item
              className="choose-asset-form-item"
              label="Asset"
              name="asset"
              rules={[{ required: true, message: "Please choose an asset!" }]}
              validateTrigger={["onSearch", "onBlur", "onChange"]}
            >
              <Search
                readOnly
                placeholder="Choose an asset...."
                value={assetName}
                className="w-[400px] ml-[75px]"
                onClick={() => {
                  setViewModalAsset(true);
                }}
                onSearch={() => {
                  setViewModalAsset(true);
                }}
              />
            </Form.Item>

            <Form.Item
              className="choose-assigned-date-form-item"
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

                    if (value.isBefore(joinedDate)) {
                      return Promise.reject(
                        new Error(
                          "Assigned date is not later than user's joined date."
                        )
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
              validateTrigger={["onBlur", "onChange"]}
            >
              <DatePicker
                defaultValue={dayjs(today, "YYYY-MM-DD")}
                className="w-[400px] ml-[27px]"
                inputReadOnly
                minDate={dayjs(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")}
                onChange={(date, dateString) => setToday(dateString)}
                allowClear={false}
              />
            </Form.Item>

            <Form.Item className="note-form-item" label="Note" name="note">
              <TextArea
                showCount
                value={note}
                maxLength={255}
                onChange={(e) => setNote(e.target.value)}
                onBlur={(e) => {
                  setNote(e.target.value.trim());
                  form.setFieldsValue({ note: e.target.value.trim() });
                }}
                placeholder="Note...."
                className="w-[400px] ml-[90px]"
                style={{ height: 120, resize: "none" }}
              />
            </Form.Item>

            <Form.Item className="gap-4 justify-end flex">
              <Button
                type="primary"
                htmlType="submit"
                disabled={isButtonDisabled}
                className="me-5 bg-red-600"
                loading={isLoading}
              >
                Save
              </Button>
              <Button danger onClick={() => navigate("/manage-assignment")}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
          {viewModalUser && (
            <SelectModal
              setisShowModal={setViewModalUser}
              type={"Select User"}
              setName={setUserName}
              setId={setUserId}
              chosenCode={staffCode}
              setCode={setStaffCode}
              date={moment().format("YYYY-MM-DD")}
              setDate={(date) => {
                setToday(date);
                setJoinedDate(date);
              }}
            />
          )}
          {viewModalAsset && (
            <SelectModal
              setisShowModal={setViewModalAsset}
              type={"Select Asset"}
              setName={setAssetName}
              setId={setAssetId}
              chosenCode={assetCode}
              setCode={setAssetCode}
            />
          )}
        </div>
      </Spin>
    </LayoutPage>
  );
};
export default CreateAssignment;
