import React, {
  FC,
  PropsWithChildren,
  forwardRef,
  Ref,
  useCallback,
  ChangeEventHandler
} from "react";

// FC是FunctionComponent的简写, 这个类型定义了默认的 props(如 children)以及一些静态属性(如 defaultProps)
export interface MyComponentProps {
  className?: string;
  style: React.CSSProperties;
  text: any;
  //  // 手动声明children
  children?: React.ReactNode;
}
export const MyComponent: FC<MyComponentProps> = ({
  text = "default text"
}) => {
  return <div>hello react</div>;
};

const App: FC<{}> = () => {
  return <MyComponent style={{ backgroundColor: "red" }} text={null} />;
};
{
  //  不要直接使用export default导出组件.
  // 这种方式导出的组件在React Inspector查看时会显示为Unknown
  // export default (props: {}) => {
  //   return <div>hello react</div>;
  // };
  // // 如果非得这么做, 请使用命名 function 定义:
  // export default function Foo(props: {}) {
  //   return <div>xxx</div>;
  // }
}

// 使用defaultProps
export interface HelloProps {
  name: string;
}

// 直接使用函数参数声明
// PropsWithChildren扩展了children, 可以自己声明
// 即原本FC只有默认的children、defaultProps等，现在是用传入的泛型参数额外进行扩展了类型
// type PropsWithChildren<P> = P & {
//    children?: ReactNode;
// }
const Hello: FC = ({ name }: PropsWithChildren<HelloProps>) => (
  <div>Hello {name}!</div>
);
//  只不过 defaultProps 的类型和组件本身的 props 没有关联性,
// 这会使得 defaultProps 无法得到类型约束, 所以必要时进一步显式声明 defaultProps 的类型:
Hello.defaultProps = { name: "TJ" } as Partial<HelloProps>;

// ✅ ok!
<Hello />;

// 泛型在一些列表型或容器型的组件中比较常用, 直接使用FC无法满足需求:

// 泛型函数组件
export interface ListProps<T> {
  visible: boolean;
  list: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function List<T>(props: ListProps<T>) {
  return <div />;
}

function Test() {
  return (
    <List
      list={[1, 2, 3]}
      visible={false}
      renderItem={(item, idx) => {
        /*自动推断i为number类型*/
        console.log(typeof item);
        return <p>{item}</p>;
      }}
    />
  );
}

// 配合高阶组件使用
export const ListComp = React.memo(props => {
  return <Test />;
}) as <T>(props: ListProps<T>) => React.ReactElement;

// 子组件声明

export interface LayoutProps {
  id: number;
}
export interface LayoutHeaderProps {} // 采用ParentChildProps形式命名
export interface LayoutFooterProps {}

export function Layout(props: PropsWithChildren<LayoutProps>) {
  return <div className="layout">{props.children}</div>;
}

// 作为父组件的属性
Layout.Header = (props: PropsWithChildren<LayoutHeaderProps>) => {
  return <div className="header">{props.children}</div>;
};

Layout.Footer = (props: PropsWithChildren<LayoutFooterProps>) => {
  return <div className="footer">{props.children}</div>;
};

// Test
<Layout id={1}>
  <Layout.Header>header</Layout.Header>
  <Layout.Footer>footer</Layout.Footer>
</Layout>;

// Forwarding Refs
// Ref不需细说，在父组件中直接操作子组件，脱离props传值再更新子组件的原有标准方法
// 之前的refs：不能是函数组件，但可以在函数组件中通过ref指向一个类组件或者dom节点
// 如果仅仅在父组件中，在子组件的引用上增加ref，那么这个ref仅仅指向子组件而不能获取其中dom界面
// 使用Forwarding Refs可以获得子组件中的dom节点
// Forwarding refs中提供了一个React.forwardRef来创建组件，在React.forwardRef的方法中传递了参数ref，
// 通过这个ref可以指向具体的某一个dom节点。具体的指向流程为：
// 父组件myRef——>React.forwardRef中的实参——>通过forwardRef方法创建的子组件中的ref——>指向子组件中的某一个dom节点
{
  // 在子组件的构造方法中，会接受传递过来的ref作为实参，然后这个实参的ref可以复制给子组件中的dom节点等。
  // const Child = React.forwardRef((props, ref) => <input ref={ref} />);
  // class Father extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.myRef = React.createRef(); // 创建一个myRef
  //   }
  //   componentDidMount() {
  //     console.log(this.myRef.current);// input
  //   }
  //   render() {
  //     return <Child ref={this.myRef} />;// myRef在子组件Child中通过制定ref={myRef}的形式传递下去
  //   }
  // }
}
{
  // render props

  interface Theme {
    [propName: string]: any;
  }

  interface ThemeConsumerProps {
    children: (theme: Theme) => React.ReactElement;
  }

  const ThemeConsumer = (props: ThemeConsumerProps): React.ReactElement => {
    const fakeTheme = { primary: "red", secondary: "blue" };
    return props.children(fakeTheme);
  };

  // Test
  <ThemeConsumer>
    {({ primary }) => {
      return <div style={{ color: primary }} />;
    }}
  </ThemeConsumer>;
}

// 命名事件处理器 handle{Type}{Event}
export const EventDemo: FC<{}> = props => {
  const handleClick = useCallback<React.MouseEventHandler>(evt => {
    evt.preventDefault();
    // ...
  }, []);

  return <button onClick={handleClick} />;
};
{
  const EventDemo: FC<{}> = props => {
    /**
     * 可以限定具体Target的类型
     */
    const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
      evt => {
        console.log(evt.target.value);
      },
      []
    );

    return <input onChange={handleChange} />;
  };
}

// 为自定义组件暴露事件处理器类型
// 自定义组件应该暴露自己的事件处理器类型, 尤其是较为复杂的事件处理器,
// 这样可以避免开发者手动为每个事件处理器的参数声明类型
// 自定义事件处理器类型以{ComponentName}{Event}Handler命名. 为了和原生事件处理器类型区分, 不使用EventHandler形式的后缀
export interface UploadValue {
  url: string;
  name: string;
  size: number;
}
// 暴露事件处理类型
export type UploadChangeHandler = (value?: UploadValue, file?: File) => void;

export interface UploadProps {
  value?: UploadValue;
  onChange?: UploadChangeHandler;
}

export const Upload: FC<UploadProps> = ({ value, onChange }) => {
  return <div>...</div>;
};

// 有些场景我们希望原生元素扩展一下一些 props. 所有原生元素 props 都继承了React.HTMLAttributes, 某些特殊元素也会扩展了自己的属性,
// 例如InputHTMLAttributes. 具体可以参考React.createElement方法的实现
export function fixClass<
  T extends Element = HTMLDivElement,
  Attribute extends React.HTMLAttributes<T> = React.HTMLAttributes<T>
>(cls: string, type: keyof React.ReactHTML = "div") {
  //
  const FixedClassName: FC<Attribute> = props => {
    return React.createElement(type, {
      ...props,
      className: `${cls} ${props.className}`
    });
  };

  return FixedClassName;
}

/**
 * Test
 */
const Container = fixClass("card");
const Header = fixClass("card__header", "header");
const Body = fixClass("card__body", "main");
const Footer = fixClass("card__body", "footer");

const TestT = () => {
  return (
    <Container>
      <Header>header</Header>
      <Body>header</Body>
      <Footer>footer</Footer>
    </Container>
  );
};

// styled-components 是目前最流行的CSS-in-js库, Typescript 在 2.9 支持泛型标签模板.
// 这意味着可以简单地对 styled-components 创建的组件进行类型约束

// 依赖于@types/styled-components
// import styled from "styled-components/macro";

// const Title = styled.h1<{ active?: boolean }>`
//   color: ${(props: { active: any }) => (props.active ? "red" : "gray")};
// `;

// // 扩展已有组件
// const NewHeader = styled(Header)<{ customColor: string }>`
//   color: ${(props: { customColor: any }) => props.customColor};
// `;
