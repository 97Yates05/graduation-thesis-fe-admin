import React from 'react';
import request from 'umi-request';
import { history, useRequest } from 'umi';

const getList = (): Promise<{
  total: number;
  data: {
    _id: string;
    name: string;
    detail: string;
    preview: string;
  }[];
}> => {
  return request.get('/api/industry-chain');
};
function List() {
  const { data, error, loading } = useRequest(() => {
    return getList();
  });

  const handleUpdate = (e: any) => {
    history.push({
      pathname: '/industry-chain',
      query: {
        id: e.currentTarget.id,
      },
      state: {
        name: e.currentTarget.title,
      },
    });
  };
  return (
    <div>
      <div>产业链列表</div>
      {data &&
        data.map((item) => {
          return (
            <div
              id={item._id}
              key={item._id}
              title={item.name}
              className="w-96 h-40 flex cursor-pointer rounded-md my-5 bg-white border-1 border-gray-300 border-solid"
              onClick={handleUpdate}
            >
              <img
                src={item.preview}
                className="w-1/2 rounded-md "
                alt="产业链预览图"
              />
              <div className="flex-1">
                <div>{item.name}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default List;
