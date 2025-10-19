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
import { type ArtifactVersion, type ArtifactType, artifactStore } from './global';

export type ViewMode = 'preview' | 'source';

interface ArtifactsContextType {
    artifacts: () => ArtifactType[];
    currentArtifact: () => ArtifactVersion | undefined;
    setCurrentArtifactById: (group_id: string, id: string) => void;
    viewMode: Accessor<ViewMode>;
    setViewMode: Setter<ViewMode>;
    isLoading: Accessor<boolean>;
    setIsLoading: Setter<boolean>;
    refreshCount: Accessor<number>;
    refresh: () => void;
}

const ArtifactsContext = createContext<ArtifactsContextType>();

export const useArtifacts = () => useContext(ArtifactsContext)!;

export const ArtifactsProvider = (props: {
    store_id: string;
    defaultArtifact: {
        group_id: string;
        version_id: string;
    };
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
    const refresh = () => {
        setRefreshCount(refreshCount() + 1);
    };
    return (
        <ArtifactsContext.Provider
            value={{
                artifacts: artifacts,
                currentArtifact: currentArtifact,
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
            }}
        >
            {props.children}
        </ArtifactsContext.Provider>
    );
};
