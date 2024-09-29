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

      const config = componentConfig[item.type];

      addComponent({
        id: new Date().getTime(),
        name: item.type,
        desc: config.desc,
        props: config.defaultProps
      }, id)
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return { canDrop, drop }
}
