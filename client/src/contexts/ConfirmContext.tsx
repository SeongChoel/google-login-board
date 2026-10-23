import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

interface ConfirmOptions {
  message: string;
  confirmLabel?: string; // 기본 "확인"
  danger?: boolean; // 삭제처럼 되돌릴 수 없는 작업이면 확인 버튼을 빨갛게
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

// window.confirm 대신 쓰는 페이지 안 확인 창.
// window.confirm은 응답할 때까지 페이지 전체를 멈춰서 브라우저 자동화 테스트가 막힌다.
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<(ok: boolean) => void>();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const close = (ok: boolean) => {
    resolveRef.current?.(ok);
    resolveRef.current = undefined;
    setOptions(null);
  };

  // 열리면 취소 버튼에 포커스(실수로 Enter를 눌러도 삭제되지 않게), Esc는 취소
  useEffect(() => {
    if (!options) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={() => close(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-message"
            className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="confirm-message" className="whitespace-pre-line text-sm text-slate-700">
              {options.message}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => close(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                  options.danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-700"
                }`}
              >
                {options.confirmLabel ?? "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const value = useContext(ConfirmContext);
  if (!value) throw new Error("useConfirm은 ConfirmProvider 안에서만 쓸 수 있습니다.");
  return value;
}
