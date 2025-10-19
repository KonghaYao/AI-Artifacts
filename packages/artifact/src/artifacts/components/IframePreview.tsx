import { createEffect, createSignal, on } from 'solid-js';
import { wrap, windowEndpoint } from 'comlink';
import { Loader2 } from 'lucide-solid';
import { useArtifacts } from '../Artifacts';

export const IframePreview = () => {
    const { currentArtifact, setIsLoading, isLoading, refreshCount } = useArtifacts();
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
        try {
            const iframeApi = await getIframeAPI(iframeRef()!);
            /* @ts-ignore */
            await iframeApi.run(currentArtifact()!.code, currentArtifact()!.filename, currentArtifact()!.filetype);
            // console.log('Running code:', currentArtifact()!.code);
        } catch (error) {
            console.error('Failed to run code:', error);
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
            />
            {isLoading() && (
                <div class="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div class="flex flex-col items-center gap-2 bg-background/80 rounded-lg p-4 shadow-md">
                        <Loader2 class="h-6 w-6 text-primary animate-spin" />
                        <p class="text-sm font-medium">正在加载代码...</p>
                    </div>
                </div>
            )}
        </>
    );
};
