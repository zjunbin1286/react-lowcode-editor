import { CommonComponentProps } from "../../interface";
import { useMaterailDrop } from "../../hooks/useMaterialDrop";

function Page({ id, name, children, styles }: CommonComponentProps) {

  // Page 组件中，可以存放其他组件
  // 每添加一个组件，都要在这里手动添加！！！
  const { canDrop, drop } = useMaterailDrop(['Button', 'Container', 'Modal', 'Table', 'Form'], id);

  return (
    <div
      data-component-id={id}
      ref={drop}
      className='p-[20px] h-[100%] box-border'
      style={{ ...styles, border: canDrop ? '1px solid #3765f9' : 'none' }}
    >
      {children}
    </div>
  )
}

export default Page;
