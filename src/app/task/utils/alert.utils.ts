import Swal from 'sweetalert2';

/**
 * Muestra una notificación tipo toast en la esquina superior derecha.
 *
 * @param title - Título del mensaje.
 * @param text - Contenido del mensaje.
 * @param icon - Tipo de notificación ('success', 'error', 'warning', 'info').
 * @param background - Color de fondo del toast.
 * @param color - Color del texto.
 */
export function showNotification(
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info',
  background: string,
  color: string
) {
  Swal.fire({
    title,
    text,
    icon,
    timer: 2000,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    background,
    color,
  });
}

/**
 * Muestra un modal de confirmación antes de ejecutar una acción.
 *
 * @param title - Título del modal de confirmación.
 * @param text - Mensaje de confirmación.
 * @param icon - Tipo de icono ('warning' o 'error').
 * @param confirmText - Texto del botón de confirmación.
 * @param confirmColor - Color del botón de confirmación.
 * @returns `true` si el usuario confirma, `false` si cancela.
 */
export async function confirmAction(
  title: string,
  text: string,
  icon: 'warning' | 'error',
  confirmText: string,
  confirmColor: string
): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: confirmColor,
    cancelButtonColor: '#64748b',
    background: '#fef2f2',
    color: '#7f1d1d',
  });

  return result.isConfirmed;
}
