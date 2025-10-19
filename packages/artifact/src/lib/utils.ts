type ClassValue = string | number | boolean | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
    const classes: string[] = [];

    function processInput(input: ClassValue) {
        if (!input) return;

        if (typeof input === 'string' || typeof input === 'number') {
            classes.push(String(input));
        } else if (Array.isArray(input)) {
            input.forEach(processInput);
        } else if (typeof input === 'object') {
            // 简单处理对象形式，如 { 'class-name': true }
            Object.entries(input).forEach(([key, value]) => {
                if (value) classes.push(key);
            });
        }
    }

    inputs.forEach(processInput);
    return classes.join(' ');
}
