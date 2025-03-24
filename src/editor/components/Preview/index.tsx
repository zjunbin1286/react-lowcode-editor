import React, { useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components"
import { message } from "antd";
import { GoToLinkConfig } from "../Setting/actions/GoToLink";
import { ShowMessageConfig } from "../Setting/actions/ShowMessage";
import { ActionConfig } from "../Setting/ActionModal";

/**
 * 预览 
 * @returns 
 */
export function Preview() {
  const { components } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();
  const componentRefs = useRef<Record<string, any>>({});
  // 绑定的事件 
  // 根据 componentConfig 里的事件类型给组件绑定事件。
  function handleEvent(component: Component) {
    const props: Record<string, any> = {};

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];

      if (eventConfig) {
        props[event.name] = (...args: any[]) => {
          eventConfig?.actions?.forEach((action: ActionConfig) => {
            if (action.type === 'goToLink') {
              // 跳转链接
              window.location.href = action.url;
            } else if (action.type === 'showMessage') {
              // 消息提醒
              if (action.config.type === 'success') {
                message.success(action.config.text);
              } else if (action.config.type === 'error') {
                message.error(action.config.text);
              }
            } else if (action.type === 'customJS') {
              // 执行自定义事件
              // new Function 可以传入任意个参数，最后一个是函数体，前面都会作为函数参数的名字。
              const func = new Function('context', 'args', action.code)
              // 传入了当前组件的 name、props 还有一个方法。
              func({
                name: component.name,
                props: component.props,
                showMessage(content: string) {
                  message.success(content);
                }
              }, args);
            } else if (action.type === 'componentMethod') {
              const component = componentRefs.current[action.config.componentId];

              if (component) {
                component[action.config.method]?.(...args);
              }
            }
          })

        }
      }
    })
    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name]

      if (!config?.prod) {
        return null;
      }

      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          // 可能需要判空处理，否则有提示（Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()）
          ref: (ref: Record<string, any>) => { componentRefs.current[component.id] = ref; },
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      )
    })
  }

  return <div>
    {renderComponents(components)}
  </div>
}
