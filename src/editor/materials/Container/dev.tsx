import { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { CommonComponentProps } from '../../interface';
import { useMaterailDrop } from '../../hooks/useMaterialDrop';

const Container = ({ id, name, children, styles }: CommonComponentProps) => {

  // Container 组件中，可以存放其他组件
  const { canDrop, drop } = useMaterailDrop(['Button', 'Container', 'Table'], id);

  const divRef = useRef<HTMLDivElement>(null);

  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: 'move',
      id: id
    }
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  return (
    <div
      data-component-id={id}
      ref={divRef}
      style={styles}
      className={`min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
    >{children}</div>
  )
}

export default Container;
