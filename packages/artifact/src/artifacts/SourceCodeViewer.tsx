'use client';
import { createMemo } from 'solid-js';
import { useArtifacts } from './Artifacts';
import { CodeBlock, CodeBlockCopyButton } from '../components/ai/code-block';

// 文件扩展名到语言映射
const fileExtensionToLanguage: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    go: 'go',
    rs: 'rust',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    php: 'php',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    md: 'markdown',
    sh: 'bash',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    // 添加更多映射...
};

// 根据文件名获取语言
const getLanguageFromFilename = (filename: string): string | undefined => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    return fileExtensionToLanguage[extension];
};

const filetypeToLanguage: Record<string, string> = {
    'application/javascript': 'javascript',
    'application/typescript': 'typescript',
    'application/json': 'json',
    'application/xml': 'xml',
    'application/yaml': 'yaml',
    'application/vnd.ant.react': 'tsx',
    'application/vnd.ant.mermaid': 'mermaid',
    'application/vnd.ant.html': 'html',
    'application/vnd.ant.css': 'css',
    'application/vnd.ant.md': 'markdown',
    'application/vnd.ant.sh': 'bash',
};

const getLanguageFromFiletype = (filetype: string): string | undefined => {
    return filetypeToLanguage[filetype];
};

export const SourceCodeViewer = () => {
    const { currentArtifact } = useArtifacts();

    // 获取代码语言
    const language = createMemo(() => {
        const artifact = currentArtifact()!;
        return (
            getLanguageFromFilename(artifact.filename || '') ||
            getLanguageFromFiletype(artifact.filetype || '') ||
            artifact.filetype ||
            ''
        );
    });
    return (
        <div class="h-full  overflow-auto">
            <CodeBlock class="p-4" language={language()} code={currentArtifact()?.code || ''}>
                <CodeBlockCopyButton />
            </CodeBlock>
        </div>
    );
};
