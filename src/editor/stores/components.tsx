import { create } from 'zustand';

export interface Component {
  /**组件唯一 id */
  id: number;
  /**组件名称 */
  name: string;
  /**组件参数 */
  props: any;
  /**组件描述 */
  desc: string;
  /**组件子级 */
  children?: Component[];
  /**父级 id，配合 children 关联父子节点 */
  parentId?: number;
}

interface State {
  /**组件树 */
  components: Component[];
  /**当前选中的组件 id */
  curComponentId?: number | null;
  /**当前选中的组件 */
  curComponent: Component | null;
}

interface Action {
  /**
   * 添加组件
   * 传入 parentId，在对应节点下新增
   * @param component 组件
   * @param parentId 父级 id
   * @returns 
   */
  addComponent: (component: Component, parentId?: number) => void;
  /**
   * 删除组件
   * 找到这个节点的 parent，在 parent.children 里删除当前节点
   * @param componentId 组件 id
   * @returns 
   */
  deleteComponent: (componentId: number) => void;
  /**
   * 更新组件
   * 找到目标 component，修改属性
   * @param componentId 组件 id
   * @param props 参数
   * @returns 
   */
  updateComponentProps: (componentId: number, props: any) => void;
  /**
   * 设置当前选中的组件 id
   * @param componentId 组件 id
   * @returns 
   */
  setCurComponentId: (componentId: number | null) => void;
}

export const useComponetsStore = create<State & Action>(
  ((set, get) => ({
    components: [
      {
        id: 1,
        name: 'Page',
        props: {},
        desc: '页面',
      }
    ],
    curComponentId: null,
    curComponent: null,
    setCurComponentId: (componentId) => {
      set((state) => ({
        curComponentId: componentId,
        curComponent: getComponentById(componentId, state.components)
      }))
    },
    addComponent: (component, parentId) =>
      set((state) => {
        if (parentId) {
          const parentComponent = getComponentById(
            parentId,
            state.components
          );

          if (parentComponent) {
            // 已有子级就 push
            if (parentComponent.children) {
              parentComponent.children.push(component);
            } else {
              // 没有子级就赋值
              parentComponent.children = [component];
            }
          }

          // 把 parentId 指向这个 parent
          component.parentId = parentId;
          return { components: [...state.components] };
        }
        return { components: [...state.components, component] };
      }),
    deleteComponent: (componentId) => {
      if (!componentId) return;
      // 找到当前组件
      const component = getComponentById(componentId, get().components);
      if (component?.parentId) {
        // 根据当前组件的 parentId 找到父级组件
        const parentComponent = getComponentById(
          component.parentId,
          get().components
        );

        if (parentComponent) {
          // 在父级 children 中过滤掉当前组件
          parentComponent.children = parentComponent?.children?.filter(
            (item) => item.id !== +componentId
          );

          set({ components: [...get().components] });
        }
      }
    },
    updateComponentProps: (componentId, props) =>
      set((state) => {
        const component = getComponentById(componentId, state.components);
        if (component) {
          component.props = { ...component.props, ...props };

          return { components: [...state.components] };
        }

        return { components: [...state.components] };
      }),
  })
  )
);

/**根据 id 获取组件 */
// 如果节点 id 是查找的目标 id 就返回当前组件，否则遍历 children 递归查找
export function getComponentById(id: number | null, components: Component[]): Component | null {
  if (!id) return null;

  for (const component of components) {
    if (component.id == id) return component;
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children);
      if (result !== null) return result;
    }
  }
  return null;
}
