import { history } from 'umi';
import 'tailwindcss/tailwind.css';
import { Button } from 'antd';
import request from 'umi-request';
import IndustryChainList from '@/pages/components/IndustryChainList';

export default function IndexPage() {
  const handleCreate = async () => {
    const data = await request.post('/api/industry-chain', {
      data: {
        name: '未命名文件',
      },
    });
    history.push({
      pathname: '/industry-chain',
      query: {
        id: data._id,
      },
      state: {
        name: '未命名文件',
      },
    });
  };
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500">
      <Button type="primary" onClick={handleCreate}>
        新建
      </Button>
      <IndustryChainList />
    </div>
  );
}
