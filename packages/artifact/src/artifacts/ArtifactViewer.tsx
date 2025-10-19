import { ArtifactsProvider, useArtifacts } from './Artifacts';
import { SourceCodeViewer } from './SourceCodeViewer';
import { ArtifactHeader, ArtifactPreview, ArtifactFooter } from './components';

export const ArtifactViewer = (props: { storeId: string; groupId: string; versionId: string }) => {
    return (
        <ArtifactsProvider
            store_id={props.storeId}
            defaultArtifact={{
                group_id: props.groupId,
                version_id: props.versionId,
            }}
        >
            <ArtifactViewerContent />
        </ArtifactsProvider>
    );
};

export const ArtifactViewerContent = () => {
    const { viewMode, currentArtifact } = useArtifacts();
    return (
        <section class="h-full w-full flex flex-col bg-white">
            {currentArtifact() && <ArtifactHeader />}
            {currentArtifact() && (
                <div class="flex-1 overflow-hidden relative">
                    {viewMode() === 'preview' ? <ArtifactPreview /> : <SourceCodeViewer />}
                </div>
            )}
            {currentArtifact() && <ArtifactFooter />}
        </section>
    );
};
