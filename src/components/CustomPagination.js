import { Pagination } from "antd";

const CustomPagination = ({ params, setParams, total }) => {
  const itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return <span>Previous</span>;
    }
    if (type === "next") {
      return <span>Next</span>;
    }

    if (type === "page") {
      const isActive = current === params.pageNumber;

      return (
        <button
          type="button"
          className={`ant-pagination-item-link ${isActive ? "active" : ""}`}
          style={{
            width: "100%",
            background: isActive ? "#d6001c" : "white",
            color: isActive ? "white" : "#d6001c",
            border: "none",
          }}
          onClick={() =>
            setParams((prev) => ({ ...prev, pageNumber: current }))
          }
        >
          {current}
        </button>
      );
    }
    return originalElement;
  };

  return (
    <Pagination
      className="text-center text-d6001c"
      current={params.pageNumber}
      defaultCurrent={params.pageNumber}
      showSizeChanger={false}
      defaultPageSize={10}
      total={total}
      onChange={(page) => setParams((prev) => ({ ...prev, pageNumber: page }))}
      itemRender={itemRender}
    />
  );
};

export default CustomPagination;
