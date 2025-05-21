
import { toast } from 'react-toastify';

import { cssTransition, Bounce } from 'react-toastify';

const Fade = cssTransition({
  enter: 'fadeIn',
  exit: 'fadeOut',
  duration: [300, 300], // [fade-in, fade-out in ms]
});

// export const TOAST_OPTIONS = {
 
//   autoClose: 15000,
//   hideProgressBar: true,
//   closeOnClick: false,
//   pauseOnHover: true,
//   draggable: true,
//   theme: 'light',
//   transition: Fade,  // ✅ Your custom fade defined inline
//   limit: 3,
//   className: 'custom-toast-container',
  
//     closeButton: false,   // ✅ This disables the "X"

// };








// new toast options trying because the old ones are not working

const BASE_OPTIONS = {
  position: 'top-left',
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
  transition: Bounce,
  closeButton: false,
  limit: 3,
};




// different toast options for different types of messages


export const showSuccessToast = (message) =>
  toast(message, {
    ...BASE_OPTIONS,
    className: 'toast-success', // Custom class for success
  });

export const showErrorToast = (message) =>
  toast(message, {
    ...BASE_OPTIONS,
    className: 'toast-error', // Custom class for error
  });

export const showInfoToast = (message) =>
  toast(message, {
    ...BASE_OPTIONS,
    className: 'toast-info', // Optional additional styles
  });

export const TOAST_OPTIONS = {
  ...BASE_OPTIONS,
  containerClassName: 'custom-toast-container',
};