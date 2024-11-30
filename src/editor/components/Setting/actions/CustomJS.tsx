import { useEffect, useState } from "react";
import { useComponetsStore } from "../../../stores/components";
import MonacoEditor, { OnMount } from '@monaco-editor/react'

export interface CustomJSConfig {
  type: 'customJS',
  code: string
}

export interface CustomJSProps {
  /**回显的数据 */
  value?: string;
  /**默认值 */
  defaultValue?: string
  /**change 事件 */
  onChange?: (config: CustomJSConfig) => void
}

export function CustomJS(props: CustomJSProps) {
  const { value: val, defaultValue, onChange } = props;

  const { curComponentId } = useComponetsStore();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(val)
  }, [val])

  function codeChange(value?: string) {
    if (!curComponentId) return;

    setValue(value);

    onChange?.({
      type: 'customJS',
      code: value!
    })
  }

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    });
  }

  return <div className='mt-[40px]'>
    <p className="mb-5">动作说明：通过 JavaScript 自定义动作编辑</p>
    <div className='flex items-start gap-[20px]'>
      <div>自定义 JS</div>
      <div>
        <MonacoEditor
          width={'600px'}
          height={'400px'}
          path='action.js'
          language='javascript'
          onMount={handleEditorMount}
          onChange={codeChange}
          value={value}
          options={
            {
              fontSize: 14,
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false,
              },
              scrollbar: {
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
              },
            }
          }
        />
      </div>
    </div>
  </div>
}
