import { createContext, createMemo, useContext, type JSX } from "solid-js";
import { type ArtifactElement, type ArtifactGroup, artifactStore, setArtifactStore } from './global'


interface ArtifactsContextType {
    artifacts: () => ArtifactGroup[];
    currentArtifact: () => ArtifactElement | null;
    setCurrentArtifactById: (group_id: string, id: string) => void;
    setShowArtifact: (show: boolean) => void;
}

const ArtifactsContext = createContext<ArtifactsContextType>({
    artifacts: () => [],
    currentArtifact: () => null,
    setCurrentArtifactById: () => { },
    setShowArtifact: () => { },
});

export const useArtifacts = () => useContext(ArtifactsContext);

export const ArtifactsProvider = (props: {
    id: string
    version_id: string
    children: JSX.Element
}) => {
    const artifacts = createMemo(() => artifactStore.artifacts[props.id])
    const currentArtifact = createMemo(() => artifacts().find((artifact) => artifact.id === props.id)?.versions.find((version) => version.id === props.version_id))
    return <ArtifactsContext.Provider
        value={{
            artifacts: artifacts,
            currentArtifact: currentArtifact,
            setCurrentArtifactById,
            setShowArtifact,
        }}
    >
        {props.children}
    </ArtifactsContext.Provider>
}