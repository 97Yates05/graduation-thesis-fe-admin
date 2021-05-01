import React, { useState } from 'react';
import { Select } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import { fetchIndustry } from '@/pages/service';
import { Cell, Node } from '@antv/x6';

interface Props {
  node: Cell<Node.Properties>;
}
function IndustrySearch({ node }: Props) {
  const [value, setValue] = useState('');
  const { data: IndustryData } = useRequest(
    () => {
      return fetchIndustry(value);
    },
    {
      formatResult: (res) => res,
      refreshDeps: [value],
    },
  );
  const handleSearch = (searchValue: string) => {
    setValue(searchValue);
  };
  const handleChange = (value: string) => {
    node && node.attr('text/textWrap/text', value);
  };
  return (
    <Select
      className="w-36"
      showSearch
      searchValue={value}
      placeholder="搜索行业"
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
    >
      {IndustryData &&
        IndustryData.map((item) => {
          return (
            <Select.Option value={item.name} key={item._id} id={item._id}>
              {item.name}{' '}
            </Select.Option>
          );
        })}
    </Select>
  );
}

export default IndustrySearch;
