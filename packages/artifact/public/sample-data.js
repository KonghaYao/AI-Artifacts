// 示例数据文件
export const sampleData = {
    artifacts: {
        default: [
            {
                id: 'react-component',
                filename: 'Button.tsx',
                filetype: 'application/vnd.ant.tsx',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z',
                versions: [
                    {
                        group_id: 'react-component',
                        id: 'v1',
                        version: 1,
                        filename: 'Button.tsx',
                        filetype: 'application/vnd.ant.tsx',
                        code: `import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary'
}) => {
    return (
        <button
            className={'btn btn-' + variant}
            onClick={onClick}
        >
            {children}
        </button>
    );
};`,
                        is_done: true,
                        created_at: '2024-01-15T10:00:00Z',
                        updated_at: '2024-01-15T10:00:00Z',
                    },
                    {
                        group_id: 'react-component',
                        id: 'v2',
                        version: 2,
                        filename: 'Button.tsx',
                        filetype: 'application/vnd.ant.react',
                        code: `import React from 'react';
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

export default ()=>{
    return (
        <div>
            <h1>Hello, World!</h1>
        </div>
    );
}`,
                        is_done: true,
                        created_at: '2024-01-15T11:30:00Z',
                        updated_at: '2024-01-15T11:30:00Z',
                    },
                ],
            },
            {
                id: 'html-page',
                filename: 'index.html',
                filetype: 'application/vnd.ant.html',
                created_at: '2024-01-15T12:00:00Z',
                updated_at: '2024-01-15T12:00:00Z',
                versions: [
                    {
                        group_id: 'html-page',
                        id: 'v1',
                        version: 1,
                        filename: 'index.html',
                        filetype: 'application/vnd.ant.html',
                        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="root">
        <h1>Welcome to My App</h1>
        <button id="myButton">Click me!</button>
    </div>
    <script src="app.js"></script>
</body>
</html>`,
                        is_done: true,
                        created_at: '2024-01-15T12:00:00Z',
                        updated_at: '2024-01-15T12:00:00Z',
                    },
                ],
            },
            {
                id: 'css-styles',
                filename: 'styles.css',
                filetype: 'application/vnd.ant.css',
                created_at: '2024-01-15T12:15:00Z',
                updated_at: '2024-01-15T12:15:00Z',
                versions: [
                    {
                        group_id: 'css-styles',
                        id: 'v1',
                        version: 1,
                        filename: 'styles.css',
                        filetype: 'application/vnd.ant.css',
                        code: `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

#root {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

/* Button styles */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background-color: #545b62;
}

.btn-outline {
    background-color: transparent;
    border: 2px solid #007bff;
    color: #007bff;
}

.btn-outline:hover {
    background-color: #007bff;
    color: white;
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
}

.btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}`,
                        is_done: true,
                        created_at: '2024-01-15T12:15:00Z',
                        updated_at: '2024-01-15T12:15:00Z',
                    },
                ],
            },
        ],
    },
};
