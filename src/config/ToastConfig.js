// src/config/ToastConfig.js
import { Bounce } from 'react-toastify';

export const TOAST_OPTIONS = {
  position: 'top-left',
  autoClose: 1500,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: false,
  limit: 3,
  transition: Bounce,

  // ← this styles each toast “sticker”
  className: 'toast-vision',

  // ← this styles the outer “paper”
  containerClassName: 'toast-container-transparent',
};