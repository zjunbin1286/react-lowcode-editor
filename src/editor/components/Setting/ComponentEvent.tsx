import { useState } from 'react';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Collapse, Input, Select, CollapseProps, Button } from 'antd';
import { useComponetsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import { GoToLink, GoToLinkConfig } from './actions/GoToLink'
import { ShowMessage, ShowMessageConfig } from './actions/ShowMessage';
import type { ComponentEvent } from '../../stores/component-config';
import { ActionConfig, ActionModal } from './ActionModal';


/**
 * 右侧事件
 * @returns 
 */
export function ComponentEvent() {

  const { curComponentId, curComponent, updateComponentProps } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEvent>();
  const [curAction, setCurAction] = useState<ActionConfig>();
  const [curActionIndex, setCurActionIndex] = useState<number>();

  if (!curComponent) return null;

  /**删除事件 */
  function deleteAction(event: ComponentEvent, index: number) {
    if (!curComponent) return;

    const actions = curComponent.props[event.name]?.actions;

    actions.splice(index, 1)

    updateComponentProps(curComponent.id, {
      [event.name]: {
        actions: actions
      }
    })
  }

  // 编辑弹窗
  function editAction(config: ActionConfig, index: number) {
    if (!curComponent) {
      return;
    }
    setCurAction(config);
    // 记录下当前编辑的 action 的 index。
    setCurActionIndex(index)
    setActionModalOpen(true);
  }

  // 从 componentConfig 取出对应组件的 events 配置。
  const items: CollapseProps['items'] = (componentConfig[curComponent.name].events || []).map(event => {
    return {
      key: event.name,
      label: (
        <div className='flex justify-between leading-[30px]'>
          {event.label}
          <Button type="primary" onClick={(e) => {
            e.stopPropagation(); // 禁止冒泡，防止收起 Collapse
            setCurEvent(event);
            setActionModalOpen(true);
          }}>添加动作</Button>
        </div>
      ),
      children: <div>
        {
          (curComponent.props[event.name]?.actions || []).map((item: ActionConfig, index: number) => {
            return (
              <div className='back'>
                {
                  item.type === 'goToLink' ? <div className=' bg-[#f7f7f9] m-3 mx-0 p-[10px] relative rounded hover:bg-[#f4f4f4]'>
                    <div >跳转链接</div>
                    <div>
                      <span className='text-[#84868c]'>跳转至：</span>
                      <span className='text-[#1677ff]'>{item.url}</span>
                    </div>
                    <div style={{ position: 'absolute', top: 10, right: 35, cursor: 'pointer' }}
                      onClick={() => editAction(item, index)}
                    ><SettingOutlined /></div>
                    <div
                      style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                      onClick={() => deleteAction(event, index)}
                    >
                      <DeleteOutlined />
                    </div>
                  </div> : null
                }
                {
                  item.type === 'showMessage' ? <div className=' bg-[#f7f7f9] m-2 mx-0 p-[10px] relative rounded '>
                    <div>消息弹窗</div>
                    <div>
                      <span className='text-[#84868c]'>{item.config.type === 'success' ? '成功消息' : '错误消息'}：</span>
                      <span className='text-[#1677ff]'>{item.config.text}</span>
                    </div>
                    <div style={{ position: 'absolute', top: 10, right: 35, cursor: 'pointer' }}
                      onClick={() => editAction(item, index)}
                    ><SettingOutlined /></div>
                    <div
                      style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                      onClick={() => deleteAction(event, index)}
                    >
                      <DeleteOutlined />
                    </div>
                  </div> : null
                }
                {
                  item.type === 'customJS' ? <div key="customJS" className='bg-[#f7f7f9] m-2 mx-0 p-[10px] relative rounded '>
                    <div>自定义 JS</div>
                    <div style={{ position: 'absolute', top: 10, right: 35, cursor: 'pointer' }}
                      onClick={() => editAction(item, index)}
                    ><SettingOutlined /></div>
                    <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                      onClick={() => deleteAction(event, index)}
                    ><DeleteOutlined /></div>
                  </div> : null
                }
              </div>
            )
          })
        }
      </div>

    }
  })

  function handleModalOk(config?: ActionConfig) {
    if (!config || !curEvent || !curComponent) {
      return;
    }

    // 保存的时候如果有 curAction，就是修改，没有的话才是新增。
    if (curAction) {
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: curComponent.props[curEvent.name]?.actions.map((item: ActionConfig, index: number) => {
            return index === curActionIndex ? config : item;
          })
        }
      })
    } else {
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: [
            ...(curComponent.props[curEvent.name]?.actions || []),
            config
          ]
        }
      })
    }

    setCurAction(undefined);

    setActionModalOpen(false)
  }

  return (
    <div className='px-[10px]'>
      <Collapse
        className='mb-[10px]'
        items={items}
        defaultActiveKey={componentConfig[curComponent.name].events?.map(item => item.name)}
      />
      <ActionModal
        action={curAction}
        visible={actionModalOpen}
        eventConfig={curEvent!}
        handleOk={handleModalOk}
        handleCancel={() => {
          setActionModalOpen(false)
        }}
      />
    </div>
  )
}
