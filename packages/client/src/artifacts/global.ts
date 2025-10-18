import { createStore } from "solid-js/store";

export interface ArtifactGroup {
    id: string;
    filename: string;
    filetype: string;
    versions: ArtifactElement[];
    created_at: string;
    updated_at: string;
}

/**
 * ArtifactElement 是单个版本化的 Artifact，它帮助我们更新数据
 */
export interface ArtifactElement {
    group_id: string;
    id: string;
    code: string;
    filename: string;
    filetype: string;
    version: number;
    is_done: boolean;
    created_at: string;
    updated_at: string;
}

export const [artifactStore, setArtifactStore] = createStore({
    artifacts: {} as Record<string, ArtifactGroup[]>
})
