import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useSunset } from '@/lib/state';
import { Button } from './ui/button';
export function ConfirmDialog({
  message,
  onConfirm,
  onClose,
}: {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useSunset();
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog className="confirm-dialog" ref={ref} onClose={onClose} aria-labelledby="confirm-title">
      <button className="dialog-close icon-button" onClick={onClose} aria-label={t('close')}>
        <X size={20} />
      </button>
      <span className="eyebrow">Sunset</span>
      <h2 id="confirm-title">{message}</h2>
      <div className="confirm-actions">
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button
          variant="primary"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {t('confirm')}
        </Button>
      </div>
    </dialog>
  );
}
