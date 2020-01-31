// 类组件与TS集成的使用

import React from "react";

// 无需添加readonly React的声明文件已经包装过了

interface Props {
  (props: any): any;
}

interface State {
  name: string;
}

// 使用class作为泛型参数
interface InputSetting {
  placeholder?: string;
  maxlength?: number;
}
export class InputProps {
  public inputSetting?: InputSetting = {
    maxlength: 20,
    placeholder: "enter name"
  };
}

export class UI extends React.Component<InputProps, State> {
  constructor(props: InputProps) {
    super(props);
    this.state = {
      name: "BUDU"
    };
  }

  // 实例化时就可以作为默认值使用
  public static defaultProps = new InputProps();

  // 组件方法大多数情况下是本组件私有方法
  private updateName(newVal: string) {
    this.setState({ name: newVal });
  }

  // 使用React内部的事件类型来定义
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value });
  }

  // 创建Ref时在对应的组件上引用时需要泛型
  private inputRef = React.createRef<HTMLInputElement>();

  render() {
    return (
      <input ref={this.inputRef} className="edit" value={this.state.name} />
    );
  }
}
