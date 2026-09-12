import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

export interface GalleryImage {
  id: string;
  url: string;
  is_cover: boolean;
}

interface ImageGalleryManagerProps {
  images: GalleryImage[];
  onUpload: (file: File) => Promise<unknown>;
  onDelete: (imageId: string) => Promise<unknown>;
  onSetCover: (imageId: string) => Promise<unknown>;
  disabled?: boolean;
}

/**
 * Galeria simples de imagens com upload (múltiplos arquivos de uma vez),
 * exclusão e "definir como capa". Reordenação fica de fora por ora — os
 * endpoints de reorder existem na API (products/images/{id}/reorder e
 * campaigns/images/{id}/reorder) mas o drag-and-drop de UI é um incremento
 * futuro, não bloqueia o CRUD.
 */
export function ImageGalleryManager({ images, onUpload, onDelete, onSetCover, disabled }: ImageGalleryManagerProps) {
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setUploadProgress({ done: 0, total: files.length });
    try {
      // Sequencial de propósito: cada upload dispara invalidação/refetch da
      // galeria — em paralelo, uploads concorrentes podem se sobrescrever
      // na definição de "capa" quando a lista ainda está vazia.
      for (let i = 0; i < files.length; i++) {
        await onUpload(files[i]);
        setUploadProgress({ done: i + 1, total: files.length });
      }
    } finally {
      setUploadProgress(null);
    }
  }

  async function handleDelete(imageId: string) {
    setPendingId(imageId);
    try {
      await onDelete(imageId);
    } finally {
      setPendingId(null);
    }
  }

  async function handleSetCover(imageId: string) {
    setPendingId(imageId);
    try {
      await onSetCover(imageId);
    } finally {
      setPendingId(null);
    }
  }

  const isUploading = uploadProgress !== null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`group relative aspect-square overflow-hidden rounded-lg border ${
              image.is_cover ? "border-gold ring-2 ring-gold" : "border-black/10"
            }`}
          >
            <img src={image.url} alt="" className="h-full w-full object-cover" />
            {image.is_cover && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-white">
                Capa
              </span>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              {!image.is_cover && (
                <button
                  type="button"
                  disabled={disabled || pendingId === image.id}
                  onClick={() => handleSetCover(image.id)}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink hover:bg-cream disabled:opacity-60"
                >
                  Definir capa
                </button>
              )}
              <button
                type="button"
                disabled={disabled || pendingId === image.id}
                onClick={() => handleDelete(image.id)}
                className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={disabled || isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-black/20 text-xs text-ink/50 transition-colors hover:border-gold hover:text-gold-dark disabled:opacity-60"
        >
          <span className="text-2xl leading-none">+</span>
          {isUploading ? `Enviando ${uploadProgress!.done}/${uploadProgress!.total}…` : "Adicionar imagens"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {images.length === 0 && (
        <p className="text-xs text-ink/50">Nenhuma imagem ainda. A primeira imagem enviada vira a capa.</p>
      )}
    </div>
  );
}

// Botão de conveniência para telas que só precisam do disparo do input (sem grid).
export function UploadImageButton({
  onUpload,
  disabled,
  label = "Adicionar imagens",
}: {
  onUpload: (file: File) => Promise<unknown>;
  disabled?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setUploadProgress({ done: 0, total: files.length });
    try {
      for (let i = 0; i < files.length; i++) {
        await onUpload(files[i]);
        setUploadProgress({ done: i + 1, total: files.length });
      }
    } finally {
      setUploadProgress(null);
    }
  }

  const isUploading = uploadProgress !== null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isUploading}
        isLoading={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? `Enviando ${uploadProgress!.done}/${uploadProgress!.total}…` : label}
      </Button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
    </>
  );
}