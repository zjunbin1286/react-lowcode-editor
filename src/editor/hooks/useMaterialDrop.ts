import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { useComponetsStore } from "../stores/components";

/**
 * 组件放下即添加物料
 * @param accept 可接收的组件
 * @param id 组件id
 * @returns 
 */
export function useMaterailDrop(accept: string[], id: number) {
  const { addComponent } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: { type: string }, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return;
      }

      const props = componentConfig[item.type].defaultProps;

      addComponent({
        id: new Date().getTime(),
        name: item.type,
        props
      }, id)
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return { canDrop, drop }
}
