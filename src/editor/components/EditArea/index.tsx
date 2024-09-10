import React, { useEffect } from "react";
import { useComponetsStore, Component } from '../../stores/components';
import { useComponentConfigStore } from "../../stores/component-config";

export function EditArea() {
  const { components, addComponent } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  /**渲染组件 */
  function renderComponents(component: Component[]): React.ReactNode {
    return component.map((component: Component) => {
      // 根据组件名称找到组件配置
      const config = componentConfig?.[component.name]

      if (!config?.component) return;

      // 拿到 name 对应的组件实例，然后用 React.cloneElement 来创建组件
      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          ...config.defaultProps,
          ...component.props,
        },
        // components 是一个树形结构，我们 render 的时候也要递归渲染
        renderComponents(component.children || [])
      )
    })
  }

  return (
    <div className="h-[100%]">
      <pre>
      </pre>
      {renderComponents(components)}
    </div>
  )
}
