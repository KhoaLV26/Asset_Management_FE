import React from "react";
import { Button, Modal } from "antd";

export const ConfirmModal = ({
  title,
  text,
  textConfirm,
  textCancel,
  onConfirm,
  onCancel,
  isShowModal,
  setisShowModal,
}) => {
  return (
    <Modal
      title={
        <h3 className="w-full border-b-4 px-10 pb-4 pt-4 rounded-md bg-[#F1F1F1] text-d6001c font-bold text-md">
          {title}
        </h3>
      }
      open={isShowModal}
      onCancel={() => setisShowModal(false)}
      footer={null}
      className="custom-modal pt-[10%]"
    >
      <div className="px-[4.5%] py-[20px] pt-[15px] pb-[15px]">
        <h1 className="text-[17px] mb-6 ml-5">{text}</h1>
        <div className="flex ms-[18px] gap-10">
          <Button
            className="bg-d6001c text-white w-[100px] text-[17px]"
            onClick={() => onConfirm()}
          >
            {textConfirm}
          </Button>
          <Button
            className="bg-white text-d6001c w-[100px] text-[17px]"
            onClick={() => onCancel()}
          >
            {textCancel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
