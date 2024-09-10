import { create } from 'zustand';
import Container from '../materials/Container';
import Button from '../materials/Button';
import Page from '../materials/Page';

/**组件配置 */
export interface ComponentConfig {
  /**组件名称 */
  name: string;
  /**组件默认属性 */
  defaultProps: Record<string, any>;
  /**组件实例 */
  component: any;
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
      component: Container
    },
    Button: {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      component: Button
    },
    Page: {
      name: 'Page',
      defaultProps: {},
      component: Page,
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