import type { Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render } from 'solid-js/web';

// 扩展 HTMLElement 以支持属性监听
declare global {
    interface HTMLElement {
        attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
    }
}

// Web Component 选项类型
export interface WebComponentOptions<TProps extends Record<string, any> = Record<string, any>> {
    /**
     * Web Component 的标签名
     */
    tagName: string;

    /**
     * Solid 组件
     */
    component: Component<TProps>;

    /**
     * 属性映射配置
     */
    propMappings?: {
        [key: string]: {
            /**
             * 属性名
             */
            attribute: string;
            /**
             * 属性类型
             */
            type?: 'string' | 'number' | 'boolean' | 'json' | 'function';
            /**
             * 默认值
             */
            defaultValue?: any;
            /**
             * 是否监听属性变化
             */
            observe?: boolean;
        };
    };

    /**
     * 事件映射配置
     */
    eventMappings?: {
        [eventName: string]: string; // Solid 事件名 -> 自定义事件名
    };

    /**
     * 是否使用 Shadow DOM
     */
    shadow?: boolean;

    /**
     * Shadow DOM 模式
     */
    shadowMode?: 'open' | 'closed';

    /**
     * 样式
     */
    styles?: string;

    /**
     * 生命周期钩子
     */
    lifecycle?: {
        onMount?: (element: HTMLElement) => void;
        onCleanup?: (element: HTMLElement) => void;
    };
}

// 属性类型转换器
const typeConverters = {
    string: (value: string | null) => value,
    number: (value: string | null) => (value ? Number(value) : undefined),
    boolean: (value: string | null) => value !== null,
    json: (value: string | null) => {
        if (!value) return undefined;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    },
    function: (value: string | null) => {
        if (!value) return undefined;
        return eval(value);
    },
};

/**
 * 创建 Solid Web Component 包装器
 */
export function createSolidWebComponent<TProps extends Record<string, any> = Record<string, any>>(
    options: WebComponentOptions<TProps>,
) {
    const {
        tagName,
        component: SolidComponent,
        propMappings = {},
        shadow = false, // 默认不使用 Shadow DOM
        shadowMode = 'open',
        styles,
        lifecycle,
    } = options;

    // 提前计算要监听的属性列表
    const observedAttributes = Object.values(propMappings)
        .filter((config) => config.observe !== false)
        .map((config) => config.attribute);
    // 创建原生 Web Component 类
    class SolidWebComponent extends HTMLElement {
        propsStore: any;
        setPropsStore: any;
        observer: MutationObserver | null = null;
        mounted = false;
        propMappings: typeof propMappings;
        SolidComponent: Component<any>;
        styles?: string;
        componentTagName: string;

        // 获取要监听的属性列表
        static observedAttributes = observedAttributes;

        constructor() {
            super();

            // 存储配置到实例
            this.propMappings = propMappings;
            this.SolidComponent = SolidComponent;
            this.styles = styles;
            this.componentTagName = tagName;

            // 如果使用 Shadow DOM，创建 Shadow Root
            if (shadow) {
                this.attachShadow({ mode: shadowMode });
            }

            // 初始化属性 store
            const initialProps: Record<string, any> = {};
            Object.entries(this.propMappings).forEach(([propName, config]) => {
                initialProps[propName] = config.defaultValue;
            });
            const [props, setProps] = createStore(initialProps);
            this.propsStore = props;
            this.setPropsStore = setProps;
        }

        // 属性变化回调
        attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
            if (oldValue === newValue) return;

            const config = Object.values(this.propMappings).find((config) => config.attribute === name);
            if (config && this.setPropsStore) {
                const convertedValue = typeConverters[config.type || 'string'](newValue);

                const propName = Object.keys(this.propMappings).find(
                    (key) => this.propMappings[key].attribute === name,
                )!;
                this.setPropsStore((data: any) => ({ ...data, [propName]: convertedValue }));
            }
        }

        // 组件连接到 DOM 时调用
        connectedCallback() {
            if (this.mounted) return;
            this.mounted = true;

            // 渲染 Solid 组件
            this.renderSolidComponent();

            // 调用生命周期钩子
            if (lifecycle?.onMount) {
                lifecycle.onMount(this);
            }
        }

        // 组件从 DOM 断开时调用
        disconnectedCallback() {
            this.mounted = false;

            // 调用生命周期钩子
            if (lifecycle?.onCleanup) {
                lifecycle.onCleanup(this);
            }

            // 清理观察器
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }

        // 渲染 Solid 组件
        renderSolidComponent() {
            // 创建包装组件
            const WrapperComponent = () => {
                return this.SolidComponent(this.propsStore);
            };

            // 获取渲染目标
            const target = shadow ? this.shadowRoot! : this;

            // 如果有样式，添加到 Shadow DOM 或创建 style 元素
            if (this.styles) {
                if (shadow) {
                    const style = document.createElement('style');
                    style.textContent = this.styles;
                    target!.appendChild(style);
                } else {
                    // 为非 Shadow DOM 创建唯一的样式 ID
                    const styleId = `solid-wc-style-${this.componentTagName}`;
                    if (!document.getElementById(styleId)) {
                        const style = document.createElement('style');
                        style.id = styleId;
                        style.textContent = this.styles;
                        document.head.appendChild(style);
                    }
                }
            }
            // 渲染 Solid 组件
            render(() => WrapperComponent(), target);
        }
    }

    // 检查是否已经注册过该组件，避免重复注册
    if (!customElements.get(tagName)) {
        customElements.define(tagName, SolidWebComponent);
    } else {
        console.warn(`Component "${tagName}" is already defined. Skipping registration.`);
    }
    return {
        tagName,
        ComponentClass: SolidWebComponent,
    };
}

/**
 * 便捷函数：将 Solid 组件快速转换为 Web Component
 */
export function solidToWebComponent<TProps extends Record<string, any> = Record<string, any>>(
    tagName: string,
    component: Component<TProps>,
    options: Omit<WebComponentOptions<TProps>, 'tagName' | 'component'> = {},
) {
    return createSolidWebComponent({
        tagName,
        component,
        ...options,
    });
}

/**
 * 工具函数：派发自定义事件
 */
export function dispatchCustomEvent(
    element: HTMLElement,
    eventName: string,
    detail?: any,
    options: EventInit = { bubbles: true, composed: true },
) {
    const event = new CustomEvent(eventName, {
        ...options,
        detail,
    });
    element.dispatchEvent(event);
}

// 主入口点
export default {
    createSolidWebComponent,
    solidToWebComponent,
    dispatchCustomEvent,
};
