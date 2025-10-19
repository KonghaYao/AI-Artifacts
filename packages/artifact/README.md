# AI Artifacts

A Web Component for displaying AI-generated artifacts with preview and source code viewing capabilities.

## Features

-   🔄 **Framework Agnostic**: Use in React, Vue, Angular, Next.js, and any Web Components-compatible framework
-   📱 **Artifact Display**: Preview and source code viewing for AI-generated content
-   🔍 **Interactive Interface**: Switch between preview and source code views
-   🎨 **Style Isolation**: Shadow DOM support for complete style encapsulation
-   📝 **Type Safety**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install ai-artifacts
# or
pnpm add ai-artifacts
# or
yarn add ai-artifacts
```

## Basic Usage

Simply use the `<ai-artifacts>` component in your HTML or any framework:

```html
<ai-artifacts store-id="my-store" group-id="react-component" version-id="v1"></ai-artifacts>
```

## Framework Integration

### React

```tsx
import React from 'react';

const ReactApp = () => {
    return (
        <div>
            <ai-artifacts store-id="my-store" group-id="react-component" version-id="v1" />
        </div>
    );
};
```

### Next.js (Pages Router)

```tsx
// pages/index.tsx
const HomePage = () => {
    return (
        <div>
            <ai-artifacts store-id="my-store" group-id="react-component" version-id="v1" />
        </div>
    );
};
```

### Next.js (App Router)

```tsx
// app/page.tsx
export default function Page() {
    return (
        <div>
            <ai-artifacts store-id="my-store" group-id="react-component" version-id="v1" />
        </div>
    );
}
```

## Component Properties

The `<ai-artifacts>` component accepts the following attributes:

-   `store-id`: Storage identifier (default: "default")
-   `group-id`: Group identifier (default: "react-component")
-   `version-id`: Version identifier (default: "v1")

```html
<!-- Custom configuration -->
<ai-artifacts store-id="my-store" group-id="custom-component" version-id="v2" />
```

## Data Management

To populate the component with your artifacts data, use the `setArtifactStore` method:

```javascript
import { setArtifactStore } from 'ai-artifacts';

const myArtifacts = {
    artifacts: {
        'my-store': [
            {
                id: 'my-component',
                filename: 'MyComponent.tsx',
                filetype: 'application/vnd.ant.tsx',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z',
                versions: [
                    {
                        group_id: 'my-component',
                        id: 'v1',
                        version: 1,
                        filename: 'MyComponent.tsx',
                        filetype: 'application/vnd.ant.tsx',
                        code: '/* your component code here */',
                        is_done: true,
                        created_at: '2024-01-15T10:00:00Z',
                        updated_at: '2024-01-15T10:00:00Z',
                    },
                ],
            },
        ],
    },
};

setArtifactStore(myArtifacts);
```

## Browser Support

Requires modern browsers with Web Components support:

-   Chrome 67+
-   Firefox 63+
-   Safari 12.1+
-   Edge 79+

For unsupported browsers, use the [webcomponents.js](https://github.com/webcomponents/polyfills) polyfills.

## Learn More

-   [Solid.js Official Website](https://solidjs.com)
-   [Web Components MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
-   [Solid.js Discord Community](https://discord.com/invite/solidjs)
