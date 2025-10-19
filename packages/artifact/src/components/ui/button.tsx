import { type Component, type JSX, splitProps } from 'solid-js';
import { cn } from '../../lib/utils';

const buttonVariants = {
    base: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-0',
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
            default: 'h-9 px-4 py-2',
            sm: 'h-8 rounded-md px-3 text-xs',
            lg: 'h-10 rounded-md px-8',
            icon: 'h-9 w-9',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
};

function getButtonClasses(variant: string = 'default', size: string = 'default', className?: string) {
    const baseClasses = buttonVariants.base;
    const variantClasses =
        buttonVariants.variants.variant[variant as keyof typeof buttonVariants.variants.variant] ||
        buttonVariants.variants.variant.default;
    const sizeClasses =
        buttonVariants.variants.size[size as keyof typeof buttonVariants.variants.size] ||
        buttonVariants.variants.size.default;

    return cn(baseClasses, variantClasses, sizeClasses, className);
}

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
}

export const Button: Component<ButtonProps> = (props) => {
    const [local, others] = splitProps(props, ['variant', 'size', 'class', 'asChild']);

    return <button class={getButtonClasses(local.variant, local.size, local.class)} {...others} />;
};
