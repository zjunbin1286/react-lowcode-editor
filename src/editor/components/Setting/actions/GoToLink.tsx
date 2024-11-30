import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useComponetsStore } from "../../../stores/components";

export interface GoToLinkConfig {
  type: 'goToLink',
  url: string
}

/**
 * 跳转链接
 */
export interface GoToLinkProps {
  /**回显的数据 */
  value?: string;
  /**默认值 */
  defaultValue?: string
  /**输入的改变事件*/
  onChange?: (config: GoToLinkConfig) => void
}

export function GoToLink(props: GoToLinkProps) {
  const { value: val, defaultValue, onChange } = props;

  const { curComponentId } = useComponetsStore();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(val)
  }, [val])

  function urlChange(value: string) {
    if (!curComponentId) return;

    setValue(value);

    onChange?.({
      type: 'goToLink',
      url: value
    });
  }

  return <div className='mt-[40px]'>
    <div className='flex items-center gap-[10px]'>
      <div>跳转链接</div>
      <div>
        <TextArea
          style={{ height: 200, width: 500, border: '1px solid #000' }}
          onChange={(e) => { urlChange(e.target.value) }}
          value={value || ''}
        />
      </div>
    </div>
  </div>
}