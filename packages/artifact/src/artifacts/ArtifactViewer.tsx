import { ArtifactsProvider, useArtifacts } from './Artifacts';
import { SourceCodeViewer } from './SourceCodeViewer';
import { ArtifactHeader, ArtifactPreview, ArtifactFooter } from './components';

export const ArtifactViewer = (props: {
    storeId: string;
    groupId: string;
    versionId: string;
    canSendBack?: () => void;
    src?: string;
}) => {
    return (
        <ArtifactsProvider
            store_id={props.storeId}
            defaultArtifact={{
                group_id: props.groupId,
                version_id: props.versionId,
            }}
            canSendBack={props.canSendBack}
        >
            <ArtifactViewerContent src={props.src} />
        </ArtifactsProvider>
    );
};

export const ArtifactViewerContent = (props: { src?: string }) => {
    const { viewMode, currentArtifact } = useArtifacts();
    return (
        <section class="h-full w-full flex flex-col bg-white">
            {currentArtifact() && <ArtifactHeader />}
            {currentArtifact() && (
                <div class="flex-1 overflow-hidden relative">
                    {viewMode() === 'preview' ? <ArtifactPreview src={props.src} /> : <SourceCodeViewer />}
                </div>
            )}
            {currentArtifact() && <ArtifactFooter />}
        </section>
    );
};
