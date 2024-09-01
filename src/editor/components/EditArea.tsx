import { useEffect } from "react";
import { useComponetsStore } from "../stores/components"

export function EditArea() {

  const { components, addComponent, deleteComponent, updateComponentProps } = useComponetsStore();

  useEffect(() => {
    addComponent({
      id: 222,
      name: 'Container',
      props: {
        title: 'coderbin'
      },
      children: []
    }, 1);
    addComponent({
      id: 333,
      name: 'Video',
      props: {},
      children: []
    }, 222);
    setTimeout(() => {
      updateComponentProps(222, { title: '666' })
    }, 1000)

    setTimeout(() => {
      deleteComponent(333)
    }, 2000)

  }, []);

  return <div>
    <pre>
      {
        JSON.stringify(components, null, 2)
      }
    </pre>
  </div>
}
