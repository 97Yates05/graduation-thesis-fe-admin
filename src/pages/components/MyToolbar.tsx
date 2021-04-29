import React from 'react';
import { Button } from 'antd';
import { RedoOutlined, SyncOutlined, UndoOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import request from 'umi-request';
import { useRequest } from 'umi';

interface Prop {
  chainId: string;
  chainName: string;
  graph: Graph;
}
const autoSave = async (graph: Graph, chainId: string, chainName: string) => {
  return new Promise((resolve, reject) => {
    graph?.toPNG(
      (dataUri: string) => {
        resolve(dataUri);
      },
      {
        padding: {
          top: 20,
          right: 30,
          bottom: 20,
          left: 30,
        },
      },
    );
  }).then((value) => {
    return request.put(`/api/industry-chain/${chainId}`, {
      data: {
        id: chainId,
        name: chainName,
        detail: JSON.stringify(graph?.toJSON()) || '',
        preview: value,
      },
    });
  });
};
function MyToolbar({ graph, chainId, chainName }: Prop) {
  const { data, error, loading } = useRequest(
    () => {
      return autoSave(graph, chainId, chainName);
    },
    {
      debounceInterval: 1000,
      refreshDeps: [graph, chainId, chainName],
    },
  );

  return (
    <div className="border-solid border-1 border-gray-200">
      <Button name="undo" type="text" icon={<UndoOutlined />} />
      <Button name="redo" type="text" icon={<RedoOutlined />} />
      <SyncOutlined spin={loading} />
    </div>
  );
}

export default MyToolbar;
