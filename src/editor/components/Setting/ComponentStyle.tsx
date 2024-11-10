import { Form, Input, InputNumber, Select } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import { ComponentConfig, ComponentSetter, useComponentConfigStore } from '../../stores/component-config';
import { useComponetsStore } from '../../stores/components';
import CssEditor from './CssEditor';
import { debounce } from 'lodash-es';
import styleToObject from 'style-to-object';

export function ComponentStyle() {

  const [css, setCss] = useState<string>(`.comp{\n\n}`);
  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentStyles } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    form.resetFields();

    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.styles });

    setCss(toCSSStr(curComponent?.styles!))
  }, [curComponent])

  if (!curComponentId || !curComponent) return null;

  function renderFormElememt(setting: ComponentSetter) {
    const { type, options } = setting;

    if (type === 'select') {
      return <Select options={options} />
    } else if (type === 'input') {
      return <Input />
    } else if (type === 'inputNumber') {
      return <InputNumber />
    }
  }

  // 当表单 value 变化的时候，同步到 store
  // 修改样式，同步组件样式
  function valueChange(changeValues: CSSProperties) {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues);
    }
  }

  // CSS 编辑器 change 事件
  const handleEditorChange = debounce((value) => {
    setCss(value);

    let css: Record<string, any> = {};

    try {
      const cssStr = value.replace(/\/\*.*\*\//, '') // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
        .replace('}', '');// 去掉 }

      styleToObject(cssStr, (name, value) => {
        css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value;
      });

      console.log(css);
      updateComponentStyles(curComponentId, { ...form.getFieldsValue(), ...css }, true);
    } catch (e) { }
  }, 500);

  // 拼接 css 字符串
  function toCSSStr(css: Record<string, any>) {
    let str = `.comp {\n`;
    for (let key in css) {
      let value = css[key];
      if (!value) {
        continue;
      }
      // 注意 with、height 要补 px，因为上面的表单的值保存的是数字
      if (['width', 'height'].includes(key) && !value.toString().endsWith('px')) {
        value += 'px';
      }

      str += `\t${key}: ${value};\n`
    }
    str += `}`;
    return str;
  }

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {
        componentConfig[curComponent.name]?.stylesSetter?.map(setter => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElememt(setter)}
          </Form.Item>
        ))
      }
      <div className='h-[200px] border-[1px] border-[#ccc]'>
        <CssEditor value={css} onChange={handleEditorChange} />
      </div>
    </Form>
  )
}
