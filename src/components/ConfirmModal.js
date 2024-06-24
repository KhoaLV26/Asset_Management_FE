import React from "react";
import { Button, Modal } from "antd";

export const ConfirmModal = ({
  title,
  text,
  textconfirm,
  textcancel,
  onConfirm,
  onCancel,
  isShowModal,
  setisShowModal,
}) => {
  return (
    <Modal
          title={
            <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold text-lg">
              {title}
            </h3>
          }
          open={isShowModal}
          onCancel={() => setisShowModal(false)}
          footer={null}
          className="custom-modal"
        >
          <div className="px-[40px] py-[20px] pt-[20px] pb-[20px]">
            <h1 className="text-lg mb-6 ml-5">{text}</h1>
            <div className="flex ms-[18px] gap-10">
                <Button className="bg-d6001c text-white w-[100px]" onClick={() => onConfirm()}>{textconfirm}</Button>
                <Button className="bg-white text-d6001c w-[100px]" onClick={() => onCancel()}>{textcancel}</Button>
            </div>
          </div>
        </Modal>
  );
};

export default ConfirmModal;
