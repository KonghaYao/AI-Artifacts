import { solidToWebComponent } from '../wc/index';
import { ArtifactViewer } from './ArtifactViewer';
import 'virtual:uno.css';

solidToWebComponent(
    'ai-artifacts',
    (props: any) => {
        return ArtifactViewer(props);
    },
    {
        propMappings: {
            storeId: {
                attribute: 'store-id',
                type: 'string',
                defaultValue: 'default',
                observe: true,
            },
            groupId: {
                attribute: 'group-id',
                type: 'string',
                defaultValue: 'react-component',
                observe: true,
            },
            versionId: {
                attribute: 'version-id',
                type: 'string',
                defaultValue: 'v1',
                observe: true,
            },
        },
        shadow: import.meta.env.PROD ? true : false,
        styles: `@unocss-placeholder
        
${''}`, // 写个空字符串保证代码正常运行
    },
);

export * from './global';
