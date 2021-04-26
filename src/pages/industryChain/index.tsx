import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Dom, Graph } from '@antv/x6';
import { Dnd } from '@antv/x6/es/addon';

function IndustryChain() {
  const [graph, setGraph] = useState<Graph>();
  const [dnd, setDnd] = useState<Dnd>();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGraph(
      new Graph({
        container: container.current as any,
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
    graph?.addNode({
      x: 100,
      y: 60,
      shape: 'activity',
    });
    graph?.addNode({
      x: 100,
      y: 60,
      shape: 'sub-activity',
    });
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
    const node =
      type === 'rect'
        ? graph?.createNode({
            width: 100,
            height: 40,
            tools: {
              name: 'button-remove', // 工具名称
            },
            attrs: {
              label: {
                text: 'Rect',
                fill: '#6a6c8a',
              },
              body: {
                stroke: '#31d0c6',
                strokeWidth: 2,
              },
            },
          })
        : graph?.createNode({
            width: 60,
            height: 60,
            shape: 'html',
            html: () => {
              const wrap = document.createElement('div');
              wrap.style.width = '100%';
              wrap.style.height = '100%';
              wrap.style.display = 'flex';
              wrap.style.alignItems = 'center';
              wrap.style.justifyContent = 'center';
              wrap.style.border = '2px solid rgb(49, 208, 198)';
              wrap.style.background = '#fff';
              wrap.style.borderRadius = '100%';
              wrap.innerText = 'Circle';
              return wrap;
            },
          });

    dnd?.start(node as any, e.nativeEvent as any);
  };
  return (
    <div className="h-almost flex flex-col">
      <div className="bg-green-500">一些其辅助功能</div>
      <div className="flex-1 flex p-12">
        <div className="flex flex-col items-center w-1/5 border-2 border-solid border-gray-50 mr-1">
          <div
            data-type="rect"
            className={styles.dndRect}
            onMouseDown={startDrag}
          >
            Rect
          </div>
          <div
            data-type="circle"
            className={styles.dndCircle}
            onMouseDown={startDrag}
          >
            Circle
          </div>
        </div>
        <div ref={container} className="flex-1" />
      </div>
    </div>
  );
}

export default IndustryChain;
