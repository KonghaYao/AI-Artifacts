# Solid Web Components 包装层

这个模块提供了一个强大的工具，将 Solid.js 组件转换为标准的 Web Components，支持属性监听、事件传递和数据变化响应。

## 特性

-   🔄 **属性监听**: 自动监听 HTML 属性变化并更新组件状态
-   📡 **事件传递**: 将 Solid 组件事件转换为标准 DOM 事件
-   🎨 **样式封装**: 支持 Shadow DOM 和样式隔离
-   📝 **类型安全**: 完整的 TypeScript 支持
-   🛠️ **易用**: 提供便捷的包装函数

## 安装依赖

确保你的项目已安装以下依赖：

```bash
pnpm add solid-element component-register
```

## 基本用法

### 1. 创建 Web Component

```tsx
import { createSolidWebComponent } from './wc/index';
import { createSignal, type Component } from 'solid-js';

const Counter: Component<{ initialCount?: number }> = (props) => {
    const [count, setCount] = createSignal(props.initialCount || 0);

    return (
        <div>
            <p>计数: {count()}</p>
            <button onClick={() => setCount(count() + 1)}>+</button>
        </div>
    );
};

// 注册为 Web Component
createSolidWebComponent({
    tagName: 'solid-counter',
    component: Counter,
    propMappings: {
        initialCount: {
            attribute: 'initial-count',
            type: 'number',
            defaultValue: 0,
            observe: true, // 监听属性变化
        },
    },
});
```

### 2. 在 HTML 中使用

```html
<solid-counter initial-count="5"></solid-counter>
```

### 3. 监听属性变化

```javascript
const counter = document.querySelector('solid-counter');
// 属性变化会自动触发组件重新渲染
counter.setAttribute('initial-count', '10');
```

## 高级用法

### 事件传递

```tsx
const Button: Component<{ onCustomClick?: () => void }> = (props) => {
    return <button onClick={props.onCustomClick}>点击我</button>;
};

createSolidWebComponent({
    tagName: 'solid-button',
    component: Button,
    eventMappings: {
        onCustomClick: 'button-click', // Solid 事件 -> 自定义事件
    },
});
```

```javascript
document.querySelector('solid-button').addEventListener('button-click', (e) => {
    console.log('按钮被点击了');
});
```

### 样式封装

```tsx
createSolidWebComponent({
    tagName: 'styled-card',
    component: Card,
    shadow: true, // 使用 Shadow DOM
    styles: `
    :host {
      display: block;
      border-radius: 8px;
    }
    .card {
      padding: 1rem;
      background: #f5f5f5;
    }
  `,
});
```

### 便捷函数

```tsx
import { solidToWebComponent } from './wc/index';

// 快速转换组件
const MyWebComponent = solidToWebComponent('my-component', MySolidComponent, {
    propMappings: {
        title: { attribute: 'title', type: 'string' },
    },
});
```

## 属性类型支持

-   `string`: 字符串类型
-   `number`: 数字类型
-   `boolean`: 布尔类型
-   `json`: JSON 对象类型

## API 参考

### `createSolidWebComponent(options)`

创建 Web Component 的主要函数。

#### 参数

-   `tagName`: Web Component 标签名
-   `component`: Solid 组件
-   `propMappings`: 属性映射配置
-   `eventMappings`: 事件映射配置
-   `shadow`: 是否使用 Shadow DOM
-   `shadowMode`: Shadow DOM 模式 ('open' | 'closed')
-   `styles`: 组件样式
-   `lifecycle`: 生命周期钩子

### `solidToWebComponent(tagName, component, options)`

便捷的组件转换函数。

### `createAttributeSignal(element, attributeName, converter, defaultValue)`

创建属性监听信号。

### `dispatchCustomEvent(element, eventName, detail, options)`

派发自定义事件。

## 示例

查看 `examples.tsx` 文件中的完整示例，包括：

-   计数器组件
-   卡片组件
-   数据展示组件
-   简单按钮组件

## 注意事项

1. 属性名使用 kebab-case (如 `initial-count`)
2. 事件监听使用标准 DOM 事件 API
3. Shadow DOM 可以提供样式隔离
4. 组件会自动处理属性类型转换
5. 生命周期钩子会在适当的时候调用

## 浏览器支持

需要支持 Web Components 的现代浏览器：

-   Chrome 67+
-   Firefox 63+
-   Safari 12.1+
-   Edge 79+

对于不支持的浏览器，可以使用 polyfills。
