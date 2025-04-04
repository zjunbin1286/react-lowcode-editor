import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponetsStore } from '../../stores/components';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface SelectedMaskProps {
  portalWrapperClassName: string
  containerClassName: string
  componentId: number;
}

function SelectedMask({ containerClassName, portalWrapperClassName, componentId }: SelectedMaskProps) {

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  // 取出当前选中的组件和组件 id
  const { components, curComponentId, deleteComponent, setCurComponentId } = useComponetsStore();

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  useEffect(() => {
    setTimeout(() => {
      updatePosition();
    }, 200)
  }, [components])

  // 窗口大小发生变化，重新计算
  useEffect(() => {
    const resizeHandler = () => {
      updatePosition();
    }
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, []);


  function updatePosition() {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    let labelLeft = left - containerLeft + width;

    if (labelTop <= 0) {
      labelTop -= -20;
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    });
  }

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!
  }, []);

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  // 删除组件
  function handleDelete() {
    deleteComponent(curComponentId!)
    setCurComponentId(null);
  }

  // 每个组件都有 component.parentId，用来找父组件也很简单，不断向上找，放到一个数组里就行
  const parentComponents = useMemo(() => {
    const parentComponents = [];
    let component = curComponent;

    while (component?.parentId) {
      component = getComponentById(component.parentId, components)!;
      parentComponents.push(component);
    }

    return parentComponents;

  }, [curComponent]);

  return createPortal((
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: (!position.width || position.width < 10) ? "none" : "inline",
          transform: 'translate(-100%, -100%)',
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map(item => ({
                key: item.id,
                label: item.desc,
              })),
              onClick: ({ key }) => {
                setCurComponentId(+key);
              }
            }}
            disabled={parentComponents.length === 0}
          >
            <div
              style={{
                padding: '0 8px',
                backgroundColor: '#1d54d4',
                borderRadius: 4,
                color: '#fff',
                cursor: "pointer",
                whiteSpace: 'nowrap',
              }}
            >
              {curComponent?.desc}
            </div>
          </Dropdown>
          {/* 如果 id 不为 1，说明不是 Page 组件，就显示删除按钮 */}
          {curComponentId !== 1 && (
            <div style={{ padding: '0 8px', backgroundColor: '#1d54d4' }}>
              <Popconfirm
                title="确认删除？"
                okText={'确认'}
                cancelText={'取消'}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: '#fff' }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>
  ), el)
}

export default SelectedMask;
