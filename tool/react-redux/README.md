# React-Redux

> 为啥这也要整理呢，是因为准备写一个用到react-redux项目的时候发现API忘得差不多了，还有 useSelector之前好像没用过，就专门整理一哈。



使用connect定义一个容器组件，包裹业务组件

```javascript
import { connect } from 'react-redux'
const VisibleTodoList = connect()(TodoList);

 <Provider store={store}>
    <App />
  </Provider>
```

入参`mapStateToProps`，定义了将仓库中状态映射到组件属性props的逻辑，

返回一个对象，以`prop：state`的键值对方式进行映射

`mapDispatchToProps`定义了将业务组件内方法映射成action的逻辑，可以为函数，此时会得到`dispatch`和`ownProps`这两个参数，返回一个对象，以`function:action`的方式进行映射。如果为对象，则键名同样对应组件中的函数。

这两者都会把映射后的属性和方法注入到props中



使用`selector`来简化`mapStateToProps`，

原先

```js
const mapStateToProps = state => {
  const { byIds, allIds } = state.todos || {};
  const todos =
    allIds && allIds.length
      ? allIds.map(id => (byIds ? { ...byIds[id], id } : null))
      : null;
  return { todos };
};
```



使用selector后

```js
// redux/selectors.js

export const getTodosState = store => store.todos;

export const getTodoList = store =>
  getTodosState(store) ? getTodosState(store).allIds : [];

export const getTodoById = (store, id) =>
  getTodosState(store) ? { ...getTodosState(store).byIds[id], id } : {};

export const getTodos = store =>
  getTodoList(store).map(id => getTodoById(store, id));


// components/TodoList.js

// ...other imports
import { connect } from "react-redux";
import { getTodos } from "../redux/selectors";

const TodoList = // ... UI component implementation

export default connect(state => ({ todos: getTodos(state) }))(TodoList);
```



调用connect的方法时不传参，或者只传入了映射属性方法，会使得组件：

- 在`store`改变时不能够重新渲染（如果不传参）
- 接收一个`props.dispatch`方法以便你手动分发actions



调用时只传入了mapDispatchToProps：

- 不订阅store
- 仍能通过props获得action创建函数

（如果指定了该属性，就不会再获得dispatch，但你可以再传回去）

```
import { bindActionCreators } from "redux";
// ...

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ increment, decrement, reset }, dispatch)
  };
}
```



注意点

- 使用选择器抽取转化数据能够提高性能
- mapStateToDispatch方法应该足够快，纯净，且同步
- 由返回值决定了是否更新组件（对于引用类型你懂吧）



使用`bindActionCreators`方法定义属性映射函数

> `bindActionCreators`将值为`action creators`的对象，转化为同键名的新对象，但将每个action creators封装到一个dispatch调用中，以便可以直接调用它们。参阅[Redux | bindActionCreators](https://www.redux.org.cn/docs/api/bindActionCreators.html)

入参：

- 一个函数/对象，类似于`mDTP`，得是action creators。

- dispatch

作用：包装action creators和dispatch

```js
import { bindActionCreators } from "redux";

const increment = () => ({ type: "INCREMENT" });
const decrement = () => ({ type: "DECREMENT" });
const reset = () => ({ type: "RESET" });

// 入参为函数 一个action creator
// 返回 (...args) => dispatch(increment(...args))
// 这样你直接 boundIncrement(payload)即可
const boundIncrement = bindActionCreators(increment, dispatch);

// 绑定一个action creators构成的object
const boundActionCreators = bindActionCreators({ increment, decrement, reset }, dispatch);
// 返回值：
// {
//   increment: (...args) => dispatch(increment(...args)),
//   decrement: (...args) => dispatch(decrement(...args)),
//   reset: (...args) => dispatch(reset(...args)),
// }
```

可以看到返回值可以直接被调用，会直接dispatch原本的action

返回值会是同名键值哈



一般使用场景是，当不想让子组件感知到redux，但又想让它拥有mutation的能力。

```js
let boundActionCreators = bindActionCreators(TodoActionCreators, dispatch);

// ...
  // 由 react-redux 注入的 todos：
    let { todos } = this.props;

    return <TodoList todos={todos} {...this.boundActionCreators} />;

    // 另一替代 bindActionCreators 的做法是
    // 直接把 dispatch 函数当作 prop 传递给子组件，但这时你的子组件需要
    // 引入 action creator 并且感知它们

    // return <TodoList todos={todos} dispatch={dispatch} />;
  }
}
```



与`mapDispatchToProps`协作

```
import { bindActionCreators } from "redux";
// ...

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ increment, decrement, reset }, dispatch);
}

// 组件能接收到 props.increment, props.decrement, props.reset
connect(
  null,
  mapDispatchToProps
)(Counter);
```



对象简写形式的**`mapDispatchToProps`**

- 每个`mapDispatchToProps`对象的字段都被假设为一个action创建函数
- 你的组件不再接收`dispatch`作为一个`prop`



```
import {increment, decrement, reset} from "./counterActions";

// React-Redux 自动为你做:
// dispatch => bindActionCreators(mapDispatchToProps, dispatch);

const actionCreators = {
  increment,
  decrement,
  reset
}

export default connect(mapState, actionCreators)(Counter);

// 或者
export default connect(
  mapState,
  { increment, decrement, reset }
)(Counter);
```



useSelector

- 严格比较，===，注意==指的是疏松比较而非浅比较，connect中使用的是浅比较来比较mapState的结果
- 缓存策略
- 纯函数

```js
const result : any = useSelector(selector : Function, equalityFn? : Function)
```

selector函数在被调用时，会获得整个store作为唯一参数。它的返回值是任意类型的，并且会被赋值给result。

selector函数不会接受到`ownProps`函数，但可以通过闭包的方式获得。

分发action时，useSelector会比较前后两次的结果，并根据是否相同进行强制渲染。

在每次函数式组件渲染时，selector函数都会被调用。

>你可以在一个函数组件中多次调用 `useSelector()`。每一个 `useSelector()` 的调用都会对 Redux 的 store 创建的一个独立的 订阅(subscription)。由于 Redux v7 的 批量更新(update batching) 行为，对于一个组件来说，如果一个 分发后(dispatched) 的 action 导致组件内部的多个 `useSelector()` 产生了新值，那么仅仅会触发一次重渲染。



相等比较：

> 对于 `mapState` 来讲，所有独立的状态域被绑定到一个对象(object) 上返回。返回对象的引用是否是新的并不重要——因为  `connect()`  会单独的比较每一个域。对于 `useSelector()` 来说，返回一个新的对象引用总是会触发重渲染，作为 `useSelector()` 默认行为。

如果需要获得多个值，可以采取的方式有：

- 多次调用这个hook
- 使用 Reselect 或类似的库来创建一个记忆化的 selector 函数，从而在一个对象中返回多个值，但是仅仅在其中一个值改变时才返回的新的对象。参考[这篇回答](https://www.zhihu.com/question/332090851/answer/730617297)

- 使用 React-Redux `shallowEqual` 函数作为 `useSelector()` 的 `equalityFn` 参数，也可以使用 Lodash 的 `_.isEqual()` 或 Immutable.js 的比较功能。

```js
import { shallowEqual, useSelector } from 'react-redux'

// later
const selectedData = useSelector(selectorReturningObject, shallowEqual)
```



使用：

> 你仍然需要Provider组件，并且用法不变

```js
import React from 'react'
import { useSelector } from 'react-redux'

export const CounterComponent = () => {
  const counter = useSelector(state => state.counter)
  return <div>{counter}</div>
}

// 使用闭包获取ownProps
export const TodoListItem = props => {
  const todo = useSelector(state => state.todos[props.id])
  return <div>{todo.text}</div>
}
```



记忆化

> 使用 `useSelector` 时使用单行箭头函数，会导致在每次渲染期间都会创建一个新的 selector 函数。可以看出，这样的 selector 函数并没有维持任何的内部状态。但是，记忆化的 selectors 函数 (通过 `reselect` 库中 的 `createSelector` 创建) 含有内部状态，所以在使用它们时必须小心。

暂时不做深入，因为好像门道挺多，等开始严格考虑性能再议。



useDispatch

```js
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch({ type: 'increment-counter' })}>
        Increment counter
      </button>
    </div>
  )
}
```

返回 Redux store 的 分发(dispatch) 函数的引用。可以用来 分发(dispatch) 某些需要的 action，当传递给子组件时，最好把它记忆化。

一旦dispatch变化，useCallback就会变化

```js
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()
  const incrementCounter = useCallback(
    () => dispatch({ type: 'increment-counter' }),
    [dispatch]
  )

  return (
    <div>
      <span>{value}</span>
      <MyIncrementButton onIncrement={incrementCounter} />
    </div>
  )
}

// Button
export const MyIncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>Increment counter</button>
))
```

