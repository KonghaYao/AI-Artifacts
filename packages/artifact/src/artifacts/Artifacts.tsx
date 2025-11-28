import {
    createContext,
    createEffect,
    createMemo,
    createSignal,
    useContext,
    type Accessor,
    type JSX,
    type Setter,
} from 'solid-js';
import { type ArtifactVersion, type ArtifactType, type ErrorData, artifactStore } from './global';

export type ViewMode = 'preview' | 'source';

interface ArtifactsContextType {
    artifacts: () => ArtifactType[];
    currentArtifact: () => ArtifactVersion | undefined;
    storeId: () => string;
    groupId: () => string;
    versionId: () => string;
    setCurrentArtifactById: (group_id: string, id: string) => void;
    viewMode: Accessor<ViewMode>;
    setViewMode: Setter<ViewMode>;
    isLoading: Accessor<boolean>;
    setIsLoading: Setter<boolean>;
    refreshCount: Accessor<number>;
    refresh: () => void;
    error: Accessor<ErrorData | null>;
    setError: Setter<ErrorData | null>;
    canSendBack: () => void;
}

const ArtifactsContext = createContext<ArtifactsContextType>();

export const useArtifacts = () => useContext(ArtifactsContext)!;

export const ArtifactsProvider = (props: {
    store_id: string;
    defaultArtifact: {
        group_id: string;
        version_id: string;
    };
    canSendBack?: () => void;
    children: JSX.Element;
}) => {
    const [showingArtifact, setShowingArtifact] = createSignal(props.defaultArtifact);
    createEffect(() => {
        setShowingArtifact(props.defaultArtifact);
    });
    const artifacts = createMemo(() => {
        return artifactStore.artifacts[props.store_id];
    });
    const currentArtifact = createMemo(() => {
        return artifacts()
            ?.find((artifact) => artifact.id === showingArtifact().group_id)
            ?.versions.find((version) => version.id === showingArtifact().version_id);
    });
    const [viewMode, setViewMode] = createSignal<ViewMode>('preview');
    const [isLoading, setIsLoading] = createSignal<boolean>(false);
    const [refreshCount, setRefreshCount] = createSignal<number>(0);
    const [error, setError] = createSignal<ErrorData | null>(null);
    const refresh = () => {
        setRefreshCount(refreshCount() + 1);
    };
    return (
        <ArtifactsContext.Provider
            value={{
                artifacts: artifacts,
                currentArtifact: currentArtifact,
                storeId: () => props.store_id,
                groupId: () => showingArtifact().group_id,
                versionId: () => showingArtifact().version_id,
                setCurrentArtifactById(group_id: string, version_id: string) {
                    setShowingArtifact({
                        group_id: group_id,
                        version_id: version_id,
                    });
                },
                viewMode: viewMode,
                setViewMode: setViewMode,
                isLoading,
                setIsLoading: setIsLoading,
                refreshCount: refreshCount,
                refresh: refresh,
                error,
                setError,
                canSendBack: props.canSendBack || (() => {}),
            }}
        >
            {props.children}
        </ArtifactsContext.Provider>
    );
};
