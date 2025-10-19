import { Show } from 'solid-js';
import { RefreshCw, Eye, Code } from 'lucide-solid';
import { useArtifacts } from '../Artifacts';
import { Button } from '../../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

export const ArtifactHeader = () => {
    const { refresh, currentArtifact, artifacts, viewMode, isLoading, setViewMode, setCurrentArtifactById } =
        useArtifacts();

    const changeFile = (value: string) => {
        setCurrentArtifactById(
            value,
            artifacts()
                ?.find((artifact) => artifact.id === value)!
                ?.versions.at(-1)?.id!,
        );
    };

    return (
        <header class="flex items-center justify-between p-2">
            <Select onValueChange={changeFile} value={currentArtifact()!.group_id!} responsive>
                <SelectTrigger class="w-fit min-w-[200px] max-w-[400px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {artifacts().map((artifact) => (
                        <SelectItem value={artifact.id}>{artifact.filename}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Show when={viewMode() === 'preview'}>
                <Button onClick={refresh} disabled={isLoading()} class="ml-auto p-2 border-none bg-transparent">
                    <RefreshCw class="h-4 w-4" classList={{ 'animate-spin': isLoading() }} />
                </Button>
            </Show>
            <div class="flex items-center gap-2">
                <Button
                    class="px-3 py-1 text-sm rounded"
                    classList={{
                        'bg-blue-500 text-white': viewMode() === 'preview',
                        'bg-gray-200': viewMode() !== 'preview',
                    }}
                    onClick={() => {
                        setViewMode('preview');
                        refresh();
                    }}
                >
                    <Eye class="h-4 w-4" />
                </Button>
                <Button
                    class="px-3 py-1 text-sm rounded"
                    classList={{
                        'bg-blue-500 text-white': viewMode() === 'source',
                        'bg-gray-200': viewMode() !== 'source',
                    }}
                    onClick={() => {
                        setViewMode('source');
                    }}
                >
                    <Code class="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
};
