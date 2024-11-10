import React, { MouseEventHandler, useEffect, useState } from "react";
import { useComponetsStore, Component } from '../../stores/components';
import { useComponentConfigStore } from "../../stores/component-config";
import HoverMask from '../HoverMask'
import SelectedMask from '../SelectedMask'

export function EditArea() {
  const { components, curComponentId, setCurComponentId } = useComponetsStore();
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
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
        },
        // components 是一个树形结构，我们 render 的时候也要递归渲染
        renderComponents(component.children || [])
      )
    })
  }

  const [hoverComponentId, setHoverComponentId] = useState<number>();

  const handleMouseOver: MouseEventHandler = (e) => {
    /**
     * 第一种获取 componentId 的方法：
     * 为什么用 nativeEvent：因为 react 里的 event 是合成事件，有的原生事件的属性它没有
     * composedPath 是从触发事件的元素到 html 根元素的路径
     * 在整个路径从底向上找，找到第一个有 data-component-id 的元素
     * 就是当前 hover 的组件
     */
    // const path = e.nativeEvent.composedPath();
    // for (let i = 0; i < path.length; i += 1) {
    //   const ele = path[i] as HTMLElement;
    //   const componentId = ele.dataset?.componentId;
    //   if (componentId) {
    //     setHoverComponentId(+componentId)
    //     return;
    //   }
    // }

    // 第二种获取 componentId 的方法：
    const target = (e.target as HTMLElement).closest('[data-component-id]');
    if (target) {
      const componentId = target.getAttribute('data-component-id')
      componentId && setHoverComponentId(Number(componentId))
    }
  }

  const handleClick: MouseEventHandler = (e) => {
    const target = (e.target as HTMLElement).closest('[data-component-id]');
    if (target) {
      const componentId = target.getAttribute('data-component-id');
      componentId && setCurComponentId(+componentId);
    }
  }

  return (
    <div
      className="h-[100%] edit-area"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => {
        setHoverComponentId(undefined)
      }}
      onClick={handleClick}
    >
      {renderComponents(components)}
      {/* hover跟点击的时候不重复显示 */}
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          portalWrapperClassName='portal-wrapper'
          containerClassName="edit-area"
          componentId={hoverComponentId}
        />
      )}
      {curComponentId && (
        <SelectedMask
          portalWrapperClassName='portal-wrapper'
          containerClassName='edit-area'
          componentId={curComponentId}
        />
      )}
      <div className="portal-wrapper"></div>
    </div>
  )
}
