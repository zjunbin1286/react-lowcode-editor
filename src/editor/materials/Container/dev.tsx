import { CommonComponentProps } from '../../interface';
import { useMaterailDrop } from '../../hooks/useMaterialDrop';

const Container = ({ id, children, styles }: CommonComponentProps) => {

  // Container 组件中，可以存放其他组件
  const { canDrop, drop } = useMaterailDrop(['Button', 'Container'], id);

  return (
    <div
      data-component-id={id}
      ref={drop}
      className={`min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
      style={styles}
    >{children}</div>
  )
}

export default Container;
