import { EdgeView, Graph, Point, Shape, ToolsView } from '@antv/x6';

export interface EditableCellToolOptions extends ToolsView.ToolItem.Options {
  x: number;
  y: number;
}

/**
 * 文字编辑工具类的实现
 */
class EditableCellTool extends ToolsView.ToolItem<
  EdgeView,
  EditableCellToolOptions
> {
  private editorContent: HTMLDivElement | undefined;

  render() {
    // 判断工具是否渲染在小地图上
    let temp = this.graph.container.style.width;
    if (Number(temp.slice(0, temp.length - 2)) < 500) {
      return this;
    }
    super.render();
    const cell = this.cell;
    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;
    if (cell.isNode()) {
      const position = cell.position();
      const size = cell.size();
      const pos = this.graph.localToGraph(position);
      const zoom = this.graph.zoom();
      x = pos.x;
      y = pos.y;
      width = size.width * zoom;
      height = size.height * zoom;
    } else {
      x = this.options.x - 40;
      y = this.options.y - 20;
      width = 80;
      height = 40;
    }

    // 文字编辑工具父节点
    const editorParent = ToolsView.createElement(
      'div',
      false,
    ) as HTMLDivElement;
    editorParent.style.position = 'absolute';
    editorParent.style.left = `${x}px`;
    editorParent.style.top = `${y}px`;
    editorParent.style.width = `${width}px`;
    editorParent.style.height = `${height}px`;
    editorParent.style.display = 'flex';
    editorParent.style.alignItems = 'center';
    editorParent.style.textAlign = 'center';

    // 文字编辑工具内容节点
    this.editorContent = ToolsView.createElement(
      'div',
      false,
    ) as HTMLDivElement;
    this.editorContent.contentEditable = 'true';
    this.editorContent.className = 'relative text-xl';
    this.editorContent.style.width = '100%';
    this.editorContent.style.outline = 'none';
    // @ts-ignore
    this.editorContent.style.color = cell ? cell.attrs.label.fill : '';
    this.editorContent.style.backgroundColor = cell.isEdge() ? '#fff' : '';
    this.editorContent.style.border = cell.isEdge() ? '1px solid #ccc' : 'none';
    editorParent.appendChild(this.editorContent);
    this.container.appendChild(editorParent);

    this.init();

    return this;
  }

  init = () => {
    const cell = this.cell;
    if (cell.isNode()) {
      const value = cell.attr('text/textWrap/text') as string;
      if (value) {
        this.editorContent && (this.editorContent.innerText = value);
        cell.attr('text/style/display', 'none');
      }
    }
    setTimeout(() => {
      this.editorContent?.focus();
    });
    document.addEventListener('mousedown', this.onMouseDown);
  };

  onMouseDown = (e: MouseEvent) => {
    if (e.target !== this.editorContent) {
      const cell = this.cell;
      const value = this.editorContent?.innerText;
      cell.removeTools();
      if (cell.isNode()) {
        cell.attr('text/textWrap/text', value);
        cell.attr('text/style/display', '');
      } else if (cell.isEdge()) {
        cell.appendLabel({
          attrs: {
            text: {
              text: value,
            },
          },
          position: {
            distance: this.getDistance(),
          },
        });
      }
      document.removeEventListener('mousedown', this.onMouseDown);
    }
  };

  getDistance() {
    const cell = this.cell;
    if (cell.isEdge()) {
      const targetPoint = cell.getTargetPoint();
      const cross = cell
        .getSourceNode()!
        .getBBox()
        .intersectsWithLineFromCenterToPoint(targetPoint)!;
      const p = new Point(this.options.x, this.options.y);
      return p.distance(cross);
    }
    return 0;
  }
}
EditableCellTool.config({
  tagName: 'div',
  isSVGElement: false,
});

// 将文字编辑工具注册到节点和边
Graph.registerEdgeTool('editableCell', EditableCellTool, true);
Graph.registerNodeTool('editableCell', EditableCellTool, true);

// 自定义活动组件
Shape.Rect.define({
  shape: 'activity',
  width: 300, // 默认宽度
  height: 100, // 默认高度
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'rect',
      selector: 'textBg',
    },
    {
      tagName: 'text',
      selector: 'label',
      className: 'text-xl',
    },
  ],
  attrs: {
    body: {
      rx: 10, // 圆角矩形
      ry: 10,
      strokeWidth: 2,
      stroke: '#70e099',
    },
    text: {
      textWrap: {
        text: 'XXX活动',
        width: -10,
      },
    },
    label: {
      fill: '#70e099',
      fontSize: 14,
      refY: 0,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
    textBg: {
      ref: 'label',
      refX: 0,
      refY: 0,
      refWidth: '100%',
      refHeight: '100%',
      fill: '#ffffff',
      strokeWidth: 0,
    },
  },
  ports: {
    groups: {
      group1: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
        position: 'left',
      },
      group2: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
        position: 'right',
      },
      group3: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
        position: 'top',
      },
      group4: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
        position: 'bottom',
      },
    },
    items: [
      {
        group: 'group1',
      },
      {
        group: 'group2',
      },
      {
        group: 'group3',
        args: {
          dy: -15,
        },
      },
      {
        group: 'group4',
      },
    ],
  },
});

// 自定义子活动组件
Shape.Rect.define({
  shape: 'sub-activity',
  width: 250, // 默认宽度
  height: 80, // 默认高度
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'rect',
      selector: 'textBg',
    },
    {
      tagName: 'text',
      selector: 'label',
      className: 'text-lg',
    },
  ],
  attrs: {
    body: {
      rx: 10, // 圆角矩形
      ry: 10,
      strokeWidth: 1.5,
      stroke: '#70cfe0',
    },
    text: {
      textWrap: {
        text: 'XXX子活动',
        width: -10,
      },
    },
    label: {
      fill: '#70cfe0',
      fontSize: 14,
      refY: 0,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
    textBg: {
      ref: 'label',
      refX: 0,
      refY: 0,
      refWidth: '100%',
      refHeight: '100%',
      fill: '#ffffff',
      strokeWidth: 0,
    },
  },
});

// 自定义行业组件
Shape.Rect.define({
  shape: 'industry',
  width: 150, // 默认宽度
  height: 50, // 默认高度
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
      className: 'text-lg',
    },
  ],
  attrs: {
    body: {
      rx: 10, // 圆角矩形
      ry: 10,
      strokeWidth: 0,
      fill: '#E0E7FF',
    },
    text: {
      textWrap: {
        text: 'XXX产业',
        width: -10,
      },
    },
    label: {
      fill: '#6366F1',
      fontSize: 14,
    },
  },
});

// request.use(async (ctx, next) => {
//   await next();
//   console.log(ctx);
//   const { req, res } = ctx;
//   notification.info({
//     message: `${req.url}接口响应`,
//     description: JSON.stringify(res),
//     duration: 0,
//   });
// });
