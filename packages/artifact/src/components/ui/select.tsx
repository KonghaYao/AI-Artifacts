import {
    type Component,
    type JSX,
    splitProps,
    createSignal,
    createEffect,
    onCleanup,
    Show,
    createContext,
    useContext,
} from 'solid-js';
import { ChevronDown, Check } from 'lucide-solid';
import { cn } from '../../lib/utils';

interface SelectContextValue {
    selectedValue: () => string | undefined;
    setSelectedValue: (value: string) => void;
    isOpen: () => boolean;
    setIsOpen: (open: boolean) => void;
    onValueChange?: (value: string) => void;
}

const SelectContext = createContext<SelectContextValue>();

interface SelectProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    responsive?: boolean;
    children: JSX.Element;
}

interface SelectTriggerProps {
    class?: string;
    children?: JSX.Element;
}

interface SelectContentProps {
    class?: string;
    children: JSX.Element;
    position?: 'bottom' | 'top' | 'auto';
}

interface SelectItemProps {
    value: string;
    disabled?: boolean;
    class?: string;
    children: JSX.Element;
}

interface SelectValueProps {
    placeholder?: string;
    class?: string;
}

// 响应式断点检测 hook
const useResponsive = () => {
    const [isMobile, setIsMobile] = createSignal(false);
    const [isTablet, setIsTablet] = createSignal(false);

    const checkScreenSize = () => {
        const width = window.innerWidth;
        setIsMobile(width < 640); // sm breakpoint
        setIsTablet(width >= 640 && width < 1024); // md breakpoint
    };

    createEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        onCleanup(() => {
            window.removeEventListener('resize', checkScreenSize);
        });
    });

    return { isMobile, isTablet };
};

// 主 Select 组件
export const Select: Component<SelectProps> = (props) => {
    const [local, others] = splitProps(props, ['value', 'defaultValue', 'onValueChange', 'children']);
    const [selectedValue, setSelectedValue] = createSignal(local.value || local.defaultValue || '');
    const [isOpen, setIsOpen] = createSignal(false);

    // 监听外部 value 变化
    createEffect(() => {
        if (local.value !== undefined) {
            setSelectedValue(local.value);
        }
    });

    const handleValueChange = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
        local.onValueChange?.(value);
    };

    const contextValue: SelectContextValue = {
        selectedValue,
        setSelectedValue: handleValueChange,
        isOpen,
        setIsOpen,
        onValueChange: local.onValueChange,
    };

    // 点击外部关闭下拉菜单
    let selectRef: HTMLDivElement | undefined;
    const handleClickOutside = (e: MouseEvent) => {
        if (selectRef && !selectRef.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    createEffect(() => {
        if (isOpen()) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        onCleanup(() => {
            document.removeEventListener('click', handleClickOutside);
        });
    });

    return (
        <SelectContext.Provider value={contextValue}>
            <div ref={selectRef!} class="relative w-full" {...others}>
                {local.children}
            </div>
        </SelectContext.Provider>
    );
};

// Select 触发器
export const SelectTrigger: Component<SelectTriggerProps> = (props) => {
    const [local, others] = splitProps(props, ['class', 'children']);
    const context = useContext(SelectContext);
    const { isMobile, isTablet } = useResponsive();

    if (!context) {
        throw new Error('SelectTrigger must be used within a Select component');
    }

    const handleClick = () => {
        context.setIsOpen(!context.isOpen());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            context.setIsOpen(!context.isOpen());
        } else if (e.key === 'Escape') {
            context.setIsOpen(false);
        }
    };

    // 响应式样式
    const getResponsiveClasses = () => {
        const baseClasses =
            'flex w-full items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-all duration-200 border-0';

        if (isMobile()) {
            return `${baseClasses} h-12 px-4 py-3 text-base rounded-lg`;
        } else if (isTablet()) {
            return `${baseClasses} h-10`;
        } else {
            return `${baseClasses} h-9`;
        }
    };

    return (
        <button
            type="button"
            role="combobox"
            aria-expanded={context.isOpen()}
            aria-haspopup="listbox"
            class={cn(getResponsiveClasses(), local.class)}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            {...others}
        >
            {local.children}
            <ChevronDown
                class={cn('h-4 w-4 opacity-50 transition-transform duration-200', context.isOpen() && 'rotate-180')}
            />
        </button>
    );
};

// Select 值显示
export const SelectValue: Component<SelectValueProps> = (props) => {
    const [local] = splitProps(props, ['placeholder', 'class']);
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error('SelectValue must be used within a Select component');
    }

    return (
        <span class={cn('block truncate', local.class)}>
            {context.selectedValue() || local.placeholder || 'Select an option...'}
        </span>
    );
};

// Select 内容容器
export const SelectContent: Component<SelectContentProps> = (props) => {
    const [local, others] = splitProps(props, ['class', 'children', 'position']);
    const context = useContext(SelectContext);
    const { isMobile } = useResponsive();

    let contentRef: HTMLDivElement | undefined;
    const [actualPosition, setActualPosition] = createSignal<'bottom' | 'top'>('bottom');

    if (!context) {
        throw new Error('SelectContent must be used within a Select component');
    }

    // 计算最佳位置
    createEffect(() => {
        if (context.isOpen() && contentRef) {
            const position = local.position || 'auto';

            if (position === 'auto') {
                const rect = contentRef.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - rect.top;
                const spaceAbove = rect.top;

                // 如果下方空间不足且上方空间更多，则向上展开
                if (spaceBelow < 200 && spaceAbove > spaceBelow) {
                    setActualPosition('top');
                } else {
                    setActualPosition('bottom');
                }
            } else {
                setActualPosition(position as 'bottom' | 'top');
            }
        }
    });

    const getContentClasses = () => {
        const baseClasses =
            'absolute z-50 min-w-full w-max rounded-md border border-solid border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 animate-in fade-in-0 zoom-in-95';

        const positionClasses = actualPosition() === 'top' ? 'bottom-full mb-1' : 'top-full mt-1';

        if (isMobile()) {
            return `${baseClasses} ${positionClasses} max-h-60 overflow-auto`;
        } else {
            return `${baseClasses} ${positionClasses} max-h-60 overflow-auto`;
        }
    };

    return (
        <Show when={context.isOpen()}>
            <div ref={contentRef} role="listbox" class={cn(getContentClasses(), local.class)} {...others}>
                {local.children}
            </div>
        </Show>
    );
};

// Select 选项
export const SelectItem: Component<SelectItemProps> = (props) => {
    const [local, others] = splitProps(props, ['value', 'disabled', 'class', 'children']);
    const context = useContext(SelectContext);
    const { isMobile } = useResponsive();

    if (!context) {
        throw new Error('SelectItem must be used within a Select component');
    }

    const isSelected = () => context.selectedValue() === local.value;

    const handleClick = () => {
        if (!local.disabled) {
            context.setSelectedValue(local.value);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!local.disabled) {
                context.setSelectedValue(local.value);
            }
        }
    };

    const getItemClasses = () => {
        const baseClasses =
            'relative flex border-1 cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

        if (isMobile()) {
            return `${baseClasses} py-3 px-4 text-base`;
        } else {
            return baseClasses;
        }
    };

    return (
        <div
            role="option"
            aria-selected={isSelected()}
            data-disabled={local.disabled}
            class={cn(
                getItemClasses(),
                isSelected() && 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
                local.class,
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={local.disabled ? -1 : 0}
            {...others}
        >
            <Show when={isSelected()}>
                <Check class="mr-2 h-4 w-4" />
            </Show>
            {local.children}
        </div>
    );
};
