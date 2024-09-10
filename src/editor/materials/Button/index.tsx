import { Button as AntdButton } from 'antd';
import { ButtonType } from 'antd/es/button';

export interface ButtonProps {
  /**类型 */
  type: ButtonType,
  /**文本 */
  text: string;
}

const Button = ({ type, text }: ButtonProps) => {
  return (
    <AntdButton type={type}>{text}</AntdButton>
  )
}

export default Button;
