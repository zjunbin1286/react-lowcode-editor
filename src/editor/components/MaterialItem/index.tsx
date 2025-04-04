import { useDrag } from "react-dnd";

export interface MaterialItemProps {
  /**组件名称 */
  name: string;
  /**组件描述 */
  desc: string;
}

export function MaterialItem(props: MaterialItemProps) {

  const { name, desc } = props;

  const [_, drag] = useDrag({
    // 当前 drag 的元素的标识
    type: name,
    item: {
      type: name,
    }
  })

  return (
    <div
      ref={drag}
      className='
        border-dashed
        border-[1px]
        border-[#000]
        py-[8px] px-[10px] 
        m-[10px]
        cursor-move
        inline-block
        bg-white
        hover:bg-[#ccc]
      '
    >
      {desc}
    </div>
  )
}
