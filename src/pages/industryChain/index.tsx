import React, { useEffect, useRef, useState } from 'react';
import { Cell, Dom, Graph, Node, Shape } from '@antv/x6';
import { Dnd } from '@antv/x6/es/addon';
import Activity from '@/pages/components/Activity';
import SubActivity from '@/pages/components/SubActivity';
import Industry from '@/pages/components/Industry';
import { setGraphHandler } from '@/pages/util';
import MyToolbar from '@/pages/components/MyToolbar';
import { Input, Modal } from 'antd';
import { useRequest } from 'umi';
import { fetchIndustryChain } from '@/pages/service';
import IndustrySearch from '@/pages/components/IndustrySearch';

interface Prop {
  location: Location & {
    query: {
      id: string;
    };
    state: {
      name: string;
    };
  };
}
function IndustryChain({ location }: Prop) {
  const [chainId] = useState(location.query.id);
  const [chainName, setChainName] = useState(location.state.name);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [node, setNode] = useState<Cell<Node.Properties>>();
  const [graph, setGraph] = useState<Graph>();
  const [dnd, setDnd] = useState<Dnd>();
  const container = useRef<HTMLDivElement>(null);
  const minimapContainer = useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<any>(null);
  const { data: IndustryChainData } = useRequest(
    () => {
      return fetchIndustryChain(chainId);
    },
    {
      formatResult: (res) => res,
    },
  );

  useEffect(() => {
    setGraph(
      new Graph({
        container: container.current as any,
        scroller: {
          enabled: true,
        },
        // 限制子节点移动范围
        translating: {
          restrict(view) {
            const cell = view.cell;
            if (cell.isNode()) {
              const parent = cell.getParent();
              if (parent) {
                return parent.getBBox();
              }
            }
            return null;
          },
        },
        // 嵌入子节点逻辑
        embedding: {
          enabled: true,
          findParent({ node }) {
            const bbox = node.getBBox();
            return this.getNodes().filter((node) => {
              const data = node.getData<any>();
              if (data && data.parent) {
                const targetBBox = node.getBBox();
                return bbox.isIntersectWithRect(targetBBox);
              }
              return false;
            });
          },
        },
        // 小地图
        minimap: {
          enabled: true,
          container: minimapContainer.current as any,
        },
        preventDefaultContextMenu: false,
        // 连线逻辑
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          connector: 'rounded',
          connectionPoint: 'boundary',
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#a0a0a0',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'classic',
                    size: 7,
                  },
                },
              },
            });
          },
        },
        // resizing: {
        //   enabled: true,
        //   minWidth: 150,
        //   minHeight: 50,
        // },
        grid: {
          size: 10, // 网格大小 10px
          visible: true, // 渲染网格背景
        },
        autoResize: true,
        snapline: true,
      }),
    );
  }, [container]);
  useEffect(() => {
    if (graph) {
      setGraphHandler(graph as Graph, container.current as HTMLDivElement);
      // 通用节点Cell监听事件
      graph.on('node:dblclick', ({ cell, e }) => {
        cell.removeTools();
        if (cell.shape === 'industry') {
          setIsModalVisible(true);
          setNode(cell);
        }
      });
      setDnd(
        new Dnd({
          target: graph as any,
          scaled: false,
          animation: true,
          validateNode(droppingNode, options) {
            return droppingNode.shape === 'html'
              ? new Promise<boolean>((resolve) => {
                  const { draggingNode, draggingGraph } = options;
                  const view = draggingGraph.findView(draggingNode)!;
                  const contentElem = view.findOne(
                    'foreignObject > body > div',
                  );
                  Dom.addClass(contentElem, 'validating');
                  setTimeout(() => {
                    Dom.removeClass(contentElem, 'validating');
                    resolve(true);
                  }, 3000);
                })
              : true;
          },
        }),
      );
    }
    if (graph && IndustryChainData) {
      graph.fromJSON(JSON.parse(IndustryChainData.detail));
    }
  }, [graph, IndustryChainData]);
  useEffect(() => {
    if (isEdit) {
      inputRef.current.focus({
        cursor: 'end',
      });
    }
  }, [isEdit]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget;
    const type = target.getAttribute('data-type');
    const node = graph?.createNode({
      width: 250,
      height: 100,
      shape: type as string,
      zIndex: type === 'activity' ? 1 : 100,
      data: {
        parent: true,
      },
    });
    dnd?.start(node as any, e.nativeEvent as any);
  };
  const handleClick = () => {
    setIsEdit(true);
  };
  const handleChange = (e: any) => {
    setChainName(e.target.value);
  };
  const handleBlur = () => {
    if (chainName === '') {
      setChainName('未命名文件');
    }
    setIsEdit(false);
  };
  return (
    <div className="h-almost flex flex-col">
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={() => {
          setIsModalVisible(false);
        }}
        footer={null}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <IndustrySearch node={node as any} />
      </Modal>

      <div className="px-10">
        <div className="min-h-80 w-80 flex items-center">
          {isEdit ? (
            <Input
              className="text-lg"
              onChange={handleChange}
              onBlur={handleBlur}
              ref={inputRef}
              value={chainName}
            />
          ) : (
            <div
              className="inline-block my-2 p-2 text-gray-500 text-xl rounded-sm hover:bg-gray-200 cursor-pointer"
              onClick={handleClick}
            >
              {chainName}
            </div>
          )}
        </div>
        <MyToolbar
          graph={graph as Graph}
          chainId={chainId}
          chainName={chainName}
        />
      </div>
      <div className="flex-1 flex p-12">
        <div className="flex flex-col items-center" style={{ width: 300 }}>
          <div ref={minimapContainer} />
          <div
            className="flex-1 flex flex-col items-center border-2 border-solid border-gray-50"
            style={{ width: 290 }}
          >
            <Activity onMouseDown={startDrag} />
            <SubActivity onMouseDown={startDrag} />
            <Industry onMouseDown={startDrag} />
          </div>
        </div>
        <div ref={container} className="flex-1" />
      </div>
    </div>
  );
}

export default IndustryChain;
