import { createEffect, createSignal, on, For } from 'solid-js';
import { wrap, windowEndpoint } from 'comlink';
import { Loader2, AlertCircle, X, Send } from 'lucide-solid';
import { useArtifacts } from '../Artifacts';
import { eventCenter, type ErrorData } from '../global';

export const IframePreview = () => {
    const { currentArtifact, setIsLoading, isLoading, refreshCount, error, setError, storeId, groupId, versionId } =
        useArtifacts();
    const [iframeRef, setIframeRef] = createSignal<HTMLIFrameElement | undefined>(undefined);

    const getIframeAPI = async (iframe: HTMLIFrameElement) => {
        const iframeApi = wrap(windowEndpoint(iframe.contentWindow!));

        // 5 秒内，每 50 ms 检测一次 init 函数
        await Promise.race(
            Array(100)
                .fill(0)
                .map((_, i) => {
                    return new Promise((resolve) => {
                        setTimeout(async () => {
                            /* @ts-ignore */
                            if (await iframeApi.init()) {
                                resolve(i);
                            }
                        }, 100 * i);
                    });
                }),
        );

        return iframeApi;
    };

    const runCode = async () => {
        if (!iframeRef()) return;

        setIsLoading(true);
        setError(null); // 清除之前的错误
        try {
            const iframeApi = await getIframeAPI(iframeRef()!);
            /* @ts-ignore */
            const data = await iframeApi.run(
                currentArtifact()!.code,
                currentArtifact()!.filename,
                currentArtifact()!.filetype,
            );
            // 如果运行成功，检查返回的数据是否包含错误
            if (data && data.status === 'error') {
                setError({
                    ...(data as ErrorData),
                    canSendBack: true,
                });
            } else {
                setError(null);
            }
            // console.log('Running code:', currentArtifact()!.code);
        } catch (error) {
            console.error('Failed to run code:', error);
            // 如果是运行时错误，也设置为错误状态
            setError({
                status: 'error',
                canSendBack: true,
                errors: [
                    {
                        severity: 'Error',
                        message: error instanceof Error ? error.message : 'Unknown error occurred',
                        labels: [],
                        codeframe: '',
                    },
                ],
            });
        } finally {
            setIsLoading(false);
        }
    };

    createEffect(() => {
        if (iframeRef() && currentArtifact()) {
            runCode();
        }
    });
    createEffect(
        on(refreshCount, () => {
            if (iframeRef() && currentArtifact()) {
                runCode();
            }
        }),
    );

    return (
        <>
            <iframe
                ref={setIframeRef}
                src="https://langgraph-artifacts.netlify.app/index.html"
                class="w-full h-full border-none"
                show-console
            />
            {isLoading() && (
                <div class="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div class="flex flex-col items-center gap-2 bg-background/80 rounded-lg p-4 shadow-md">
                        <Loader2 class="h-6 w-6 text-primary animate-spin" />
                        <p class="text-sm font-medium">Loading Code...</p>
                    </div>
                </div>
            )}
            {error() && (
                <div class="absolute top-4 right-4 left-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4 z-20  overflow-y-auto text-red-600 h-full">
                    <div class="flex items-start justify-between gap-2 mb-2">
                        <div class="flex items-center gap-2">
                            <AlertCircle class="h-5 w-5 text-destructive flex-shrink-0" />
                            <h3 class="font-semibold text-destructive">Compile Error</h3>
                        </div>
                        <div class="flex items-center gap-2">
                            {error()!.canSendBack && (
                                <button
                                    onClick={() => {
                                        eventCenter.emit('sendBackToAI', {
                                            storeId: storeId(),
                                            groupId: groupId(),
                                            versionId: versionId(),
                                            file: currentArtifact()!.code,
                                            error: error()!
                                                .errors.map((err, index) => {
                                                    let formattedError = `${index + 1}. ${err.severity}: ${
                                                        err.message
                                                    }`;

                                                    if (err.labels.length > 0) {
                                                        const labelInfo = err.labels
                                                            .map(
                                                                (label) =>
                                                                    `   • ${label.message} (position: ${label.start}-${label.end})`,
                                                            )
                                                            .join('\n');
                                                        formattedError += `\n${labelInfo}`;
                                                    }

                                                    if (err.codeframe) {
                                                        formattedError += `\n   Code snippet:\n   ${err.codeframe}`;
                                                    }

                                                    return formattedError;
                                                })
                                                .join('\n\n'),
                                        });
                                        // canSendBack();
                                    }}
                                    class="flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors cursor-pointer border-none"
                                >
                                    <Send class="h-4 w-4" />
                                    Send Back
                                </button>
                            )}
                            <button
                                onClick={() => setError(null)}
                                class="text-destructive/70 hover:text-destructive transition-colors cursor-pointer border-none bg-transparent"
                            >
                                <X class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <For each={error()!.errors}>
                            {(err) => (
                                <div class="border-l-2 border-destructive pl-3">
                                    <p class="text-sm font-medium text-destructive mb-1">
                                        {err.severity}: {err.message}
                                    </p>
                                    {err.labels.length > 0 && (
                                        <div class="text-xs text-destructive mb-2">
                                            <For each={err.labels}>
                                                {(label) => (
                                                    <div>
                                                        {label.message} (Position: {label.start}-{label.end})
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    )}
                                    {err.codeframe && (
                                        <pre class="text-xs bg-muted p-2 rounded border overflow-x-auto">
                                            <code class="text-destructive">{err.codeframe}</code>
                                        </pre>
                                    )}
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            )}
        </>
    );
};
