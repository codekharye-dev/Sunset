import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const variants = cva('btn', {
  variants: {
    variant: { primary: 'btn-primary', outline: 'btn-outline', ghost: 'btn-ghost' },
    size: { default: '', sm: 'btn-sm', icon: 'btn-icon' },
  },
  defaultVariants: { variant: 'outline', size: 'default' },
});
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variants> & { asChild?: boolean };
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(variants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';
