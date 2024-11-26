import { Modal, Segmented } from "antd";
import { useState } from "react";
import { GoToLink, GoToLinkConfig } from "./actions/GoToLink";
import { ComponentEvent } from "../../stores/component-config";
import { ShowMessage, ShowMessageConfig } from "./actions/ShowMessage";

interface ActionModalProps {
  /**弹窗显示隐藏 */
  visible: boolean
  /**事件配置 */
  eventConfig: ComponentEvent
  /**点击确定的回调 */
  handleOk: (config?: GoToLinkConfig | ShowMessageConfig) => void
  /**点击取消的回调 */
  handleCancel: () => void
}

/**
 * 事件弹窗
 * @param props 
 * @returns 
 */
export function ActionModal(props: ActionModalProps) {
  const { visible, handleOk, eventConfig, handleCancel } = props;

  const [key, setKey] = useState<string>('访问链接');
  const [curConfig, setCurConfig] = useState<GoToLinkConfig | ShowMessageConfig>();

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
        <Segmented value={key} onChange={setKey} block options={['访问链接', '消息提示', '自定义 JS']} />
        {
          key === '访问链接' && <GoToLink onChange={(config) => {
            setCurConfig(config);
          }} />
        }
        {
          key === '消息提示' && <ShowMessage onChange={(config) => {
            setCurConfig(config);
          }} />
        }
      </div>
    </Modal>
  )
}
