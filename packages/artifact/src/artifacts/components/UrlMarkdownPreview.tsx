import { createSignal, createEffect, Show } from 'solid-js';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-solid';
// import { Button } from "@/components/ui/button";
// import { MarkdownRenderer } from "../../components/shared/MarkdownRenderer";
// import { SolidMarkdown } from 'solid-markdown';
import { useArtifacts } from '../Artifacts';

export const UrlMarkdownPreview = () => {
    const { currentArtifact, isLoading, setIsLoading } = useArtifacts();
    const [content, setContent] = createSignal<string>('');
    const [error, setError] = createSignal<string | null>(null);

    const fetchUrlContent = async (url: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // 添加 CORS 代理或直接请求
            const response = await fetch('/api/crawler', {
                body: JSON.stringify({ url }),
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            setContent(text);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '获取内容失败';
            setError(errorMessage);
            console.error('Failed to fetch URL content:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return url.startsWith('http://') || url.startsWith('https://');
        } catch {
            return false;
        }
    };

    const handleRetry = () => {
        const url = currentArtifact()!.code.trim();
        if (isValidUrl(url)) {
            fetchUrlContent(url);
        }
    };

    createEffect(() => {
        if (currentArtifact()?.code) {
            const url = currentArtifact()!.code.trim();
            if (isValidUrl(url)) {
                fetchUrlContent(url);
            } else {
                setError('无效的 URL 格式，请提供有效的 HTTP/HTTPS URL');
            }
        }
    });

    return (
        <div class="h-full w-full">
            <Show when={isLoading()}>
                <div class="h-full w-full flex items-center justify-center">
                    <div class="flex flex-col items-center gap-2">
                        <Loader2 class="h-6 w-6 text-primary animate-spin" />
                        <p class="text-sm text-muted-foreground">正在获取内容...</p>
                        <p class="text-xs text-muted-foreground">{currentArtifact()!.code}</p>
                    </div>
                </div>
            </Show>

            <Show when={!isLoading() && error()}>
                <div class="h-full w-full flex items-center justify-center">
                    <div class="flex flex-col items-center gap-4 text-center max-w-md">
                        <AlertCircle class="h-8 w-8 text-destructive" />
                        <div>
                            <p class="text-sm font-medium mb-1">获取内容失败</p>
                            <p class="text-xs text-muted-foreground">{error()}</p>
                        </div>
                        <div class="text-xs text-muted-foreground">
                            <p class="font-medium">URL:</p>
                            <p class="break-all">{currentArtifact()!.code}</p>
                        </div>
                        <Show when={isValidUrl(currentArtifact()!.code.trim())}>
                            <button
                                onClick={handleRetry}
                                class="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <RefreshCw class="h-4 w-4" />
                                重试
                            </button>
                        </Show>
                    </div>
                </div>
            </Show>

            <Show when={!isLoading() && !error() && !content()}>
                <div class="h-full w-full flex items-center justify-center">
                    <div class="text-center">
                        <p class="text-sm text-muted-foreground">内容为空</p>
                    </div>
                </div>
            </Show>

            <Show when={!isLoading() && !error() && content()}>
                <div class="h-full w-full overflow-auto p-6">
                    {/* <SolidMarkdown renderingStrategy="reconcile" children={currentArtifact()!.code} /> */}
                    <pre>{content()}</pre>
                </div>
            </Show>
        </div>
    );
};
