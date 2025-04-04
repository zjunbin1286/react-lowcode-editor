import { create } from 'zustand';
import ContainerDev from '../materials/Container/dev';
import ContainerProd from '../materials/Container/prod';
import ButtonDev from '../materials/Button/dev';
import ButtonProd from '../materials/Button/prod';
import PageDev from '../materials/Page/dev';
import PageProd from '../materials/Page/prod';
import ModalDev from '../materials/Modal/dev'
import ModalProd from '../materials/Modal/prod'
import TableDev from '../materials/Table/dev'
import TableProd from '../materials/Table/prod'
import TableColumnDev from '../materials/TableColumn/dev'
import TableColumnProd from '../materials/TableColumn/prod'
import FormDev from '../materials/Form/dev'
import FormProd from '../materials/Form/prod'
import FormItemDev from '../materials/FormItem/dev'
import FormItemProd from '../materials/FormItem/prod'

/**设置组件属性 */
export interface ComponentSetter {
  /**字段名 */
  name: string;
  /**前面的文案 */
  label: string;
  /**表单类型 */
  type: string;
  [key: string]: any;
}

/**组件事件 */
export interface ComponentEvent {
  /**事件名 */
  name: string;
  /**事件描述 */
  label: string;
}

/**组件方法 */
export interface ComponentMethod {
  name: string
  label: string
}

/**组件配置 */
export interface ComponentConfig {
  /**组件名称 */
  name: string;
  /**组件默认属性 */
  defaultProps: Record<string, any>;
  /**组件描述 */
  desc: string;
  /**组件实例 */
  // component?: any;
  /**组件属性设置 */
  setter?: ComponentSetter[];
  /**组件 CSS 属性设置 */
  stylesSetter?: ComponentSetter[];
  /**编辑状态的组件 */
  dev?: any;
  /**预览状态的组件 */
  prod?: any;
  /**组件的事件 */
  events?: ComponentEvent[];
  /**组件的方法 */
  methods?: ComponentMethod[];
}

// state 就是 componentConfig 的映射。
interface State {
  // key 是组件名，value 是组件配置
  componentConfig: { [key: string]: ComponentConfig }
}

// action 就是往 componentConfig 里加配置
interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

/**
 * component 名字和 Component 实例的映射
 */
export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Container: {
      name: 'Container',
      defaultProps: {},
      desc: '容器',
      dev: ContainerDev,
      prod: ContainerProd
    },
    Button: {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      desc: '按钮',
      dev: ButtonDev,
      prod: ButtonProd,
      setter: [
        {
          name: 'type',
          label: '按钮类型',
          type: 'select',
          // select 类型的表单多一个 options 来配置选项。
          options: [
            { label: '主按钮', value: 'primary' },
            { label: '次按钮', value: 'default' },
          ]
        },
        {
          name: 'text',
          label: '文本',
          type: 'input',
        }
      ],
      stylesSetter: [
        {
          name: 'width',
          label: '宽度',
          type: 'inputNumber',
        },
        {
          name: 'height',
          label: '高度',
          type: 'inputNumber',
        },
      ],
      events: [
        {
          name: 'onClick',
          label: '点击事件',
        },
        {
          name: 'onDoubleClick',
          label: '双击事件',
        },
      ]
    },
    Page: {
      name: 'Page',
      defaultProps: {},
      desc: '页面',
      dev: PageDev,
      prod: PageProd
    },
    Modal: {
      name: 'Modal',
      defaultProps: {
        title: '弹窗'
      },
      setter: [
        {
          name: 'title',
          label: '标题',
          type: 'input'
        }
      ],
      stylesSetter: [],
      events: [
        {
          name: 'onOk',
          label: '确认事件',
        },
        {
          name: 'onCancel',
          label: '取消事件'
        },
      ],
      methods: [
        {
          name: 'open',
          label: '打开弹窗',
        },
        {
          name: 'close',
          label: '关闭弹窗'
        }
      ],
      desc: '弹窗',
      dev: ModalDev,
      prod: ModalProd
    },
    Table: {
      name: 'Table',
      defaultProps: {},
      desc: '表格',
      setter: [
        {
          name: 'url',
          label: 'url',
          type: 'input',
        },
      ],
      dev: TableDev,
      prod: TableProd
    },
    TableColumn: {
      name: 'TableColumn',
      desc: '表格列',
      defaultProps: {
        dataIndex: `col_${new Date().getTime()}`,
        title: '列名'
      },
      setter: [
        {
          name: 'type',
          label: '类型',
          type: 'select',
          options: [
            {
              label: '文本',
              value: 'text',
            },
            {
              label: '日期',
              value: 'date',
            },
          ],
        },
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
        {
          name: 'dataIndex',
          label: '字段',
          type: 'input',
        },
      ],
      dev: TableColumnDev,
      prod: TableColumnProd,
    },
    Form: {
      name: 'Form',
      defaultProps: {},
      desc: '表单',
      setter: [
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
      ],
      events: [
        {
          name: 'onFinish',
          label: '提交事件',
        }
      ],
      methods: [
        {
          name: 'submit',
          label: '提交',
        }
      ],
      dev: FormDev,
      prod: FormProd
    },
    FormItem: {
      name: 'FormItem',
      desc: '表单项',
      defaultProps: {
        name: new Date().getTime(),
        label: '姓名'
      },
      dev: FormItemDev,
      prod: FormItemProd,
      setter: [
        {
          name: 'type',
          label: '类型',
          type: 'select',
          options: [
            {
              label: '文本',
              value: 'input',
            },
            {
              label: '日期',
              value: 'date',
            },
          ],
        },
        {
          name: 'label',
          label: '标题',
          type: 'input',
        },
        {
          name: 'name',
          label: '字段',
          type: 'input',
        },
        {
          name: 'rules',
          label: '校验',
          type: 'select',
          options: [
            {
              label: '必填',
              value: 'required',
            },
          ],
        }
      ]
    }

  },
  // 往 componentConfig 里加配置
  registerComponent: (name, componentConfig) => set((state) => {
    return {
      ...state,
      componentConfig: {
        ...state.componentConfig,
        [name]: componentConfig
      }
    }
  })
}))

/**
 * compnent 名字和 Component 实例的映射
 */