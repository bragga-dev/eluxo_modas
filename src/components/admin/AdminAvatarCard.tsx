import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as adminApi from "@/api/admin";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Overlay";
import { EditIcon, CameraIcon, TrashIcon } from "@/components/ui/Icons";
import { ApiError } from "@/types/api";

export function AdminAvatarCard() {
  const { me, applyAdminUpdate } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const photoMutation = useMutation({
    mutationFn: adminApi.uploadAdminPhoto,
    onSuccess: (admin) => {
      applyAdminUpdate(admin);
      showToast("Foto atualizada.", "success");
      setIsModalOpen(false);
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível enviar a foto.", "error"),
  });

  const removePhotoMutation = useMutation({
    mutationFn: adminApi.deleteAdminPhoto,
    onSuccess: (admin) => {
      applyAdminUpdate(admin);
      showToast("Foto removida.", "success");
      setIsModalOpen(false);
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível remover a foto.", "error"),
  });

  const hasPhoto = Boolean(me?.admin?.photo_url);
  const isBusy = photoMutation.isPending || removePhotoMutation.isPending;

  return (
    <div className="flex flex-col items-center gap-3 border-b border-black/8 pb-6 text-center">
      <div className="relative h-24 w-24">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-cream ring-1 ring-black/5">
          {me?.admin?.photo_url ? (
            <img src={me.admin.photo_url} alt="Foto de perfil" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-ink/30">
              {me?.user.email.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Editar foto de perfil"
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white shadow-card transition-colors hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2"
        >
          <EditIcon className="h-4 w-4" />
        </button>
      </div>

      {me?.admin?.full_name && <p className="font-display text-lg text-ink">{me.admin.full_name}</p>}
      {me?.user.email && <p className="text-sm text-ink/50">{me.user.email}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) photoMutation.mutate(file);
          e.target.value = "";
        }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Alterar foto de perfil">
        <div className="flex flex-col items-center gap-5">
          <p className="text-sm text-ink/60">Use uma imagem clara e de boa qualidade.</p>

          <div className="h-24 w-24 overflow-hidden rounded-full bg-cream">
            {me?.admin?.photo_url ? (
              <img src={me.admin.photo_url} alt="Foto de perfil" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-ink/30">
                {me?.user.email.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => fileInputRef.current?.click()}
              isLoading={photoMutation.isPending}
              disabled={isBusy}
            >
              <CameraIcon className="h-4 w-4" />
              Alterar foto
            </Button>
            {hasPhoto && (
              <Button
                variant="outline"
                size="md"
                fullWidth
                className="border-red-600 text-red-600 hover:bg-red-50 focus-visible:ring-red-600"
                onClick={() => removePhotoMutation.mutate()}
                isLoading={removePhotoMutation.isPending}
                disabled={isBusy}
              >
                <TrashIcon className="h-4 w-4" />
                Excluir foto
              </Button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-sm font-medium text-ink/60 hover:text-ink"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}