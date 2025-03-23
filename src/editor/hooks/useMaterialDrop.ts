import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponetsStore } from "../stores/components";

/**
 * 组件放下即添加物料
 * @param accept 可接收的组件
 * @param id 组件id
 * @returns 
 */
export interface ItemType {
  type: string;
  dragType?: 'move' | 'add',
  id: number
}

export function useMaterailDrop(accept: string[], id: number) {
  const { addComponent, deleteComponent, components } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: ItemType, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return;
      }

      // 编辑区组件的拖拽，只移动位置
      if (item.dragType === 'move') {
        const component = getComponentById(item.id, components)!;

        deleteComponent(item.id);

        addComponent(component, id)
      } else {
        // 物料区组件的拖拽，新增组件
        const config = componentConfig[item.type];

        addComponent({
          id: new Date().getTime(),
          name: item.type,
          desc: config.desc,
          props: config.defaultProps
        }, id)
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return { canDrop, drop }
}