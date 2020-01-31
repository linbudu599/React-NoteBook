import React from "react";

interface State {
  itemText: string;
}

type Props = {
  handleSubmit: (value: string) => void;
  children: React.ReactNode;
} & Partial<typeof todoInputDefaultProps>;

const todoInputDefaultProps = {
  inputSetting: {
    maxlength: 20,
    placeholder: "请输入todo"
  }
};

// 将defaultProps 中已经声明值的属性从『可选类型』转化为『非可选类型』，即必选。
export const createPropsGetter = <DP extends object>(defaultProps: DP) => {
  // 泛型P必须包含可选的DP类型，实际上泛型P就是组件传入的Props泛型
  return <P extends Partial<DP>>(props: P) => {
    // Omit = Exclude + Pick
    // Omit<T, K>的作用是忽略T中的某些属性
    // 在这里即是剔除掉默认属性部分
    type PropsExcludingDefaults = Omit<P, keyof DP>;
    // 将默认属性的类型 DP 与剔除了默认属性的 Props 类型结合在一起。
    type RecomposedProps = DP & PropsExcludingDefaults;

    return (props as any) as RecomposedProps;
  };
};

// 即：原本默认属性中部分属性已声明值，而另外一部分没有
// 剔除了Props类中关于默认属性的部分，再将剩下的部分与DP组成一个新的类型

const getProps = createPropsGetter(todoInputDefaultProps);

export class TodoInput extends React.Component<Props, State> {
  public static defaultProps = todoInputDefaultProps;

  constructor(props: Props) {
    super(props);
    this.state = {
      itemText: ""
    };
  }

  public render() {
    const { itemText } = this.state;
    const { updateValue, handleSubmit } = this;
    const { inputSetting } = getProps(this.props);

    return (
      <form onSubmit={handleSubmit}>
        <input
          maxLength={inputSetting.maxlength}
          type="text"
          value={itemText}
          onChange={updateValue}
        />
        <button type="submit">添加todo</button>
      </form>
    );
  }

  private updateValue(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ itemText: e.target.value });
  }

  private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!this.state.itemText.trim()) {
      return;
    }

    this.props.handleSubmit(this.state.itemText);
    this.setState({ itemText: "" });
  }
}
