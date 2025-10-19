import { createMemo, createSignal } from 'solid-js';
import { GitBranchPlus, Copy, Download, CheckCircle2 } from 'lucide-solid';
import { Button } from '../../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { useArtifacts } from '../Artifacts';

export const ArtifactFooter = () => {
    const [isCopied, setIsCopied] = createSignal(false);
    const { currentArtifact, artifacts, setCurrentArtifactById } = useArtifacts();

    // 获取当前 artifact 的所有版本
    const currentComposedArtifact = createMemo(() => artifacts().find((a) => a.id === currentArtifact()!.group_id));

    const handleCopyCode = async () => {
        console.log(currentArtifact());
        if (currentArtifact()?.code) {
            try {
                await navigator.clipboard.writeText(currentArtifact()!.code);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error('无法复制代码:', err);
            }
        }
    };

    const handleDownloadCode = () => {
        if (currentArtifact()?.code) {
            const blob = new Blob([currentArtifact()!.code], {
                type: 'text/plain',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentArtifact()!.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <footer class="border-t p-2 flex items-center justify-between bg-muted/30">
            <div class="flex items-center gap-2">
                <GitBranchPlus class="h-6 w-6" />
                <Select
                    value={currentArtifact()!.version.toString()}
                    onValueChange={(value: string) => {
                        const selectedVersion = currentComposedArtifact()?.versions.find(
                            (v) => v.version === parseInt(value),
                        );
                        if (selectedVersion) {
                            setCurrentArtifactById(selectedVersion.group_id, selectedVersion.id);
                        }
                    }}
                    responsive
                >
                    <SelectTrigger class="w-[100px] h-8 text-xs">
                        v<SelectValue />
                    </SelectTrigger>
                    <SelectContent position="top">
                        {currentComposedArtifact()?.versions.map((version) => (
                            <SelectItem value={version.version.toString()}>v{version.version}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div class="flex items-center gap-2">
                <div class="text-xs text-muted-foreground mr-2">{currentArtifact()!.filetype?.toUpperCase()}</div>
                <Button variant="ghost" size="icon" class="h-8 w-8" onClick={handleCopyCode}>
                    {isCopied() ? <CheckCircle2 class="h-4 w-4 text-green-500" /> : <Copy class="h-4 w-4" />}
                </Button>

                <Button variant="ghost" size="icon" class="h-8 w-8" onClick={handleDownloadCode}>
                    <Download class="h-4 w-4" />
                </Button>
            </div>
        </footer>
    );
};
