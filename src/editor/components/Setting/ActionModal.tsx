import { Modal, Segmented } from "antd";
import { useEffect, useState } from "react";
import { GoToLink, GoToLinkConfig } from "./actions/GoToLink";
import { ComponentEvent } from "../../stores/component-config";
import { ShowMessage, ShowMessageConfig } from "./actions/ShowMessage";
import { CustomJS, CustomJSConfig } from "./actions/CustomJS";
import { ComponentMethod, ComponentMethodConfig } from "./actions/ComponentMethod";

interface ActionModalProps {
  /**弹窗显示隐藏 */
  visible: boolean
  /**事件配置 */
  eventConfig: ComponentEvent
  /**点击确定的回调 */
  handleOk: (config?: ActionConfig) => void
  /**点击取消的回调 */
  handleCancel: () => void
  /**当前的动作 */
  action?: ActionConfig
}

export type ActionConfig = GoToLinkConfig | ShowMessageConfig | CustomJSConfig | ComponentMethodConfig;

/**
 * 事件弹窗
 * @param props 
 * @returns 
 */
export function ActionModal(props: ActionModalProps) {
  const { visible, handleOk, action, handleCancel } = props;

  const [key, setKey] = useState<string>('访问链接');
  const [curConfig, setCurConfig] = useState<ActionConfig>();

  const map = {
    goToLink: '访问链接',
    showMessage: '消息提示',
    customJS: '自定义 JS',
    componentMethod: '组件方法'
  }

  // 编辑打开弹窗时，设置当前的 key，显示对应 tab
  useEffect(() => {
    if (action?.type) {
      setKey(map[action?.type])
    }
  })

  return (
    <Modal
      title="事件动作配置"
      width={800}
      open={visible}
      okText="添加"
      cancelText="取消"
      onOk={() => handleOk(curConfig)}
      onCancel={handleCancel}
    >
      <div className="h-[500px]">
        <Segmented value={key} onChange={setKey} block options={['访问链接', '消息提示', '组件方法', '自定义 JS']} />
        {
          key === '访问链接' && (
            <GoToLink
              key="goToLink"
              value={action?.type === 'goToLink' ? action.url : ''}
              onChange={(config) => {
                setCurConfig(config);
              }}
            />
          )
        }
        {
          key === '消息提示' && (
            <ShowMessage
              key="showMessage"
              value={action?.type === 'showMessage' ? action.config : undefined}
              onChange={(config) => {
                setCurConfig(config);
              }}
            />
          )
        }
        {
          key === '组件方法' && (
            <ComponentMethod
              key="showMessage"
              value={action?.type === 'componentMethod' ? action.config : undefined}
              onChange={(config) => {
                setCurConfig(config);
              }}
            />
          ) 
        }
        {
          key === '自定义 JS' && (
            <CustomJS
              key="customJS"
              value={action?.type === 'customJS' ? action.code : ''}
              onChange={(config) => {
                setCurConfig(config);
              }}
            />
          )
        }
      </div>
    </Modal>
  )
}
