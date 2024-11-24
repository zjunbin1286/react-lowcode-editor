import { Collapse, Input, Select, CollapseProps } from 'antd';
import { useComponetsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import { GoToLink } from './actions/GoToLink'
import { ShowMessage } from './actions/ShowMessage';

export function ComponentEvent() {

  const { curComponentId, curComponent, updateComponentProps } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  if (!curComponent) return null;

  // 选择某个动作的时候，把它保存到 store 里。
  function selectAction(eventName: string, value: string) {
    if (!curComponentId) return;

    updateComponentProps(curComponentId, { [eventName]: { type: value, } })
  }

  // 从 componentConfig 取出对应组件的 events 配置。
  const items: CollapseProps['items'] = (componentConfig[curComponent.name].events || []).map(event => {
    return {
      key: event.name,
      label: event.label,
      children: (
        <div>
          <div className='flex items-center'>
            <div>动作：</div>
            <Select
              className='w-[160px]'
              value={curComponent?.props?.[event.name]?.type}
              options={[
                { label: '显示提示', value: 'showMessage' },
                { label: '跳转链接', value: 'goToLink' },
              ]}
              onChange={(value) => { selectAction(event.name, value) }}
            />
          </div>
          {
            curComponent?.props?.[event.name]?.type === 'goToLink' && <GoToLink event={event} />
          }
          {
            curComponent?.props?.[event.name]?.type === 'showMessage' && <ShowMessage event={event} />
          }
        </div>
      )
    }
  })

  return <div className='px-[10px]'>
    <Collapse className='mb-[10px]' items={items} />
  </div>
}
