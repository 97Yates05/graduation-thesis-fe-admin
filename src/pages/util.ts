import { Graph } from '@antv/x6';

const changePortsVisible = (visible: boolean, container: HTMLDivElement) => {
  const ports = container.querySelectorAll(
    '.x6-port-body',
  ) as NodeListOf<SVGAElement>;
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = visible ? 'visible' : 'hidden';
  }
};

export const setGraphHandler = (graph: Graph, container: HTMLDivElement) => {
  // 通用节点Cell监听事件
  graph.on('cell:dblclick', ({ cell, e }) => {
    cell.removeTools();
    const p = graph.clientToGraph(e.clientX, e.clientY);
    if (cell.shape !== 'industry') {
      cell.addTools([
        {
          name: 'editableCell',
          args: {
            x: p.x,
            y: p.y,
          },
        },
      ]);
    }
  });
  graph.on('cell:mouseenter', ({ cell }) => {
    cell.addTools({
      name: 'button-remove',
      args: {
        x: 0,
        y: 0,
        offset: { x: 10, y: 10 },
      },
    });
  });
  graph.on('cell:mouseleave', ({ cell }) => {
    cell.removeTools(['button-remove']);
  });
  // 节点Node监听事件
  graph.on('node:mouseenter', () => {
    changePortsVisible(true, container);
  });
  graph.on('node:mouseleave', () => {
    changePortsVisible(false, container);
  });
  // 边Edge监听事件
  graph.on('edge:mouseenter', ({ cell }) => {
    cell.addTools([
      'source-arrowhead',
      'segments',
      {
        name: 'target-arrowhead',
        args: {
          attrs: {
            fill: 'red',
          },
        },
      },
    ]);
  });
  graph.on('edge:mouseleave', ({ cell }) => {
    cell.removeTools(['source-arrowhead', 'segments', 'target-arrowhead']);
  });
};
