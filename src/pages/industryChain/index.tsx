import React, { useEffect, useRef, useState } from 'react';
import { Dom, Graph } from '@antv/x6';
import { Dnd } from '@antv/x6/es/addon';
import Activity from '@/pages/components/Activity';
import SubActivity from '@/pages/components/SubActivity';

function IndustryChain() {
  const [graph, setGraph] = useState<Graph>();
  const [dnd, setDnd] = useState<Dnd>();
  const container = useRef<HTMLDivElement>(null);
  const minimapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGraph(
      new Graph({
        container: container.current as any,
        scroller: {
          enabled: true,
        },
        minimap: {
          enabled: true,
          container: minimapContainer.current as any,
        },
        preventDefaultContextMenu: false,
        resizing: {
          enabled: true,
          minWidth: 100,
          minHeight: 40,
        },
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
    graph?.on('cell:dblclick', ({ cell, e }) => {
      const p = graph.clientToGraph(e.clientX, e.clientY);
      cell.addTools([
        {
          name: 'editableCell',
          args: {
            x: p.x,
            y: p.y,
          },
        },
      ]);
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
                const contentElem = view.findOne('foreignObject > body > div');
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
  }, [graph]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget;
    const type = target.getAttribute('data-type');
    const node = graph?.createNode({
      width: 250,
      height: 100,
      tools: {
        name: 'button-remove', // 工具名称
      },
      shape: type as string,
    });
    dnd?.start(node as any, e.nativeEvent as any);
  };
  return (
    <div className="h-almost flex flex-col">
      <div className="bg-green-500">一些其辅助功能</div>
      <div className="flex-1 flex p-12">
        <div className="flex flex-col items-center" style={{ width: 300 }}>
          <div ref={minimapContainer} />
          <div
            className="flex-1 flex flex-col items-center border-2 border-solid border-gray-50"
            style={{ width: 290 }}
          >
            <Activity onMouseDown={startDrag} />
            <SubActivity onMouseDown={startDrag} />
          </div>
        </div>
        <div ref={container} className="flex-1" />
      </div>
    </div>
  );
}

export default IndustryChain;
