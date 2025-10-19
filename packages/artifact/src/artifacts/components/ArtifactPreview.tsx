import { Switch, Match, createMemo } from 'solid-js';
import { IframePreview } from './IframePreview';

import { SourceCodeViewer } from '../SourceCodeViewer';
import { PreviewType, getPreviewConfig } from '../config/previewConfig';
import { useArtifacts } from '../Artifacts';

export const ArtifactPreview = () => {
    const { currentArtifact } = useArtifacts();
    // 获取预览配置
    const previewConfig = createMemo(() => {
        return getPreviewConfig(currentArtifact()?.filetype || '');
    });

    return (
        <Switch
            fallback={
                <div class="flex items-center justify-center h-full text-muted-foreground">该文件类型不支持预览</div>
            }
        >
            <Match when={previewConfig().type === PreviewType.IFRAME}>
                <IframePreview />
            </Match>

            {/* <Match when={previewConfig().type === PreviewType.MARKDOWN}>
                <div class="h-full w-full overflow-auto p-6">
                    <MarkdownRenderer content={currentArtifact.code} />
                </div>
            </Match> */}

            <Match when={previewConfig().type === PreviewType.CODE}>
                <div class="overflow-y-auto h-full">
                    <SourceCodeViewer />
                </div>
            </Match>
        </Switch>
    );
};
