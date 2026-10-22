import { ChangeEvent, FormEvent, useRef, useState } from "react";

// TODO: 제목/본문 상태 관리 및 게시글 작성 API 호출을 구현하세요.
// TODO: 이미지를 선택하면 Cloudflare R2에 먼저 업로드해서 URL을 받아온 뒤,
//       그 URL을 게시글 데이터와 함께 서버에 저장하세요.
export default function PostWritePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("TODO: 게시글 작성 처리", { imageFile });
  };

  const inputClass =
    "rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">게시글 작성</h1>

      <form className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6" onSubmit={handleSubmit}>
        <label className={labelClass}>
          제목
          <input type="text" name="title" placeholder="제목을 입력하세요" className={inputClass} />
        </label>

        <label className={labelClass}>
          내용
          <textarea
            name="content"
            rows={8}
            placeholder="내용을 입력하세요"
            className={`${inputClass} resize-none`}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">이미지</span>

          {imagePreview ? (
            <div className="relative w-fit">
              <img
                src={imagePreview}
                alt="첨부 이미지 미리보기"
                className="max-h-64 rounded-md border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white hover:bg-slate-700"
                aria-label="이미지 제거"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-fit items-center gap-2 rounded-md border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              이미지 업로드
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors sm:self-start sm:px-8"
        >
          작성 완료
        </button>
      </form>
    </section>
  );
}
