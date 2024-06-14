import { Pagination } from 'antd';

const CustomPagination = ({ params, setParams, total }) => {
  const itemRender = (current, type) => {
    if (type === "prev") {
        return <span>Previous</span>;
      }
    if (type === "next") {
        return <span>Next</span>;
    }
    
    const isActive = current === params.pageNumber;

    return (
      <button
        type="button"
        className={`ant-pagination-item-link ${isActive ? 'active' : ''}`}
        style={{
          width: '100%',
          background: isActive ? '#d6001c' : 'white',
          color: isActive ? 'white' : '#d6001c',
          border: 'none',
        }}
        onClick={() => setParams(prev => ({ ...prev, pageNumber: current }))}>
        {current}
      </button>
    );
  };

  return (
    <Pagination
      className="text-center text-d6001c"
      current={params.pageNumber}
      defaultCurrent={params.pageNumber}
      showSizeChanger={false}
      defaultPageSize={15}
      total={total}
      onChange={page => setParams(prev => ({ ...prev, pageNumber: page }))}
      itemRender={itemRender}
    />
  );
};

export default CustomPagination;
