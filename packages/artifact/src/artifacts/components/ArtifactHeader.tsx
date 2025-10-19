import { Show } from 'solid-js';
import { RefreshCw } from 'lucide-solid';
import { useArtifacts } from '../Artifacts';
import { Button } from '../../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

export const ArtifactHeader = () => {
    const { currentArtifact, artifacts, viewMode, isLoading, setViewMode, setCurrentArtifactById } = useArtifacts();
    const refresh = () => {
        // setCurrentArtifactById(currentArtifact()!.group_id, currentArtifact()!.id);
    };
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
            {/* <div class="flex items-center space-x-4 flex-wrap">
                <span class="truncate max-w-[200px]">{currentArtifact()?.filename}</span>
            </div> */}
            <Select onValueChange={changeFile} value={currentArtifact()!.group_id!} responsive>
                <SelectTrigger class="w-fit min-w-[200px] max-w-[400px]">
                    <SelectValue placeholder="选择文件..." />
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
                    <span class="sr-only">刷新</span>
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
                    预览
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
                    源代码
                </Button>
            </div>
        </header>
    );
};
