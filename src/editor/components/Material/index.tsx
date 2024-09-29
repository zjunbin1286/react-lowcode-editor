import { useMemo } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { MaterialItem } from "../MaterialItem";

export function Material() {
  const { componentConfig } = useComponentConfigStore();

  const components = useMemo(() => {
    // 不需要展示容器 Page
    return Object.values(componentConfig).filter(item => item.name !== 'Page');
  }, [componentConfig]);

  return (
    <div>
      {
        components.map((item, index) => {
          return <MaterialItem key={item.name + index} name={item.name} desc={item.desc} />
        })
      }
    </div>
  )
}
