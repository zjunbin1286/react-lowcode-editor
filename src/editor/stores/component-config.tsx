import { create } from 'zustand';
import ContainerDev from '../materials/Container/dev';
import ContainerProd from '../materials/Container/prod';
import ButtonDev from '../materials/Button/dev';
import ButtonProd from '../materials/Button/prod';
import PageDev from '../materials/Page/dev';
import PageProd from '../materials/Page/prod';

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
      ]
    },
    Page: {
      name: 'Page',
      defaultProps: {},
      desc: '页面',
      dev: PageDev,
      prod: PageProd
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