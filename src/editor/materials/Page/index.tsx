import { CommonComponentProps } from "../../interface";
import { useMaterailDrop } from "../../hooks/useMaterialDrop";

function Page({ id, name, children }: CommonComponentProps) {

  // Page 组件中，可以存放其他组件
  const { canDrop, drop } = useMaterailDrop(['Button', 'Container'], id);

  return (
    <div
      data-component-id={id}
      ref={drop}
      className='p-[20px] h-[100%] box-border'
      style={{ border: canDrop ? '1px solid #3765f9' : 'none' }}
    >
      {children}
    </div>
  )
}

export default Page;
