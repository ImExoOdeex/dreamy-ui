import { useCallback, useState } from "react";

export interface UseClipboardProps {
    /**
     * The time in milliseconds to wait before resetting the clipboard.
     * @default 5000
     */
    timeout?: number;
}

/**
 * Copies the given text to the clipboard.
 * @param { number } timeout - timeout in ms, default 2000
 * @returns { copy, copied, error, reset } - copy function, copied state, error state, reset function
 */
export function useClipboard({ timeout = 5000 }: UseClipboardProps = {}) {
    const [error, setError] = useState<Error | null>(null);
    const [copied, setCopied] = useState(false);
    const [copyTimeout, setCopyTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    const onClearTimeout = useCallback(() => {
        if (copyTimeout) {
            clearTimeout(copyTimeout);
        }
    }, [copyTimeout]);

    const handleCopyResult = useCallback(
        (value: boolean) => {
            onClearTimeout();
            setCopyTimeout(setTimeout(() => setCopied(false), timeout));
            setCopied(value);
        },
        [onClearTimeout, timeout]
    );

    const copy = useCallback(
        (valueToCopy: any) => {
            if ("clipboard" in navigator) {
                navigator.clipboard
                    .writeText(valueToCopy)
                    .then(() => handleCopyResult(true))
                    .catch((err) => setError(err));
            } else {
                setError(new Error("useClipboard: navigator.clipboard is not supported"));
            }
        },
        [handleCopyResult]
    );

    const reset = useCallback(() => {
        setCopied(false);
        setError(null);
        onClearTimeout();
    }, [onClearTimeout]);

    return { copy, reset, error, copied };
}

export type UseClipboardReturn = ReturnType<typeof useClipboard>;
