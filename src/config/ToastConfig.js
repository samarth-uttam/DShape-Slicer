

// importing thel libraries 
import { toast } from 'react-toastify';
import { cssTransition  } from 'react-toastify';
import { TOAST_COLORS , TOAST_STYLE, TOAST_CONTAINER_STYLE} from './InitConfig';
import { MoveLeft } from 'lucide-react';



// the global styling as Fade to the toasts 

const Fade = cssTransition({
  enter: 'fadeIn',
  exit: 'fadeOut',
  duration: [300, 300], // [fade-in, fade-out in ms]
});


// getting the current time to add to the prefix to all the toasts 
const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , second : '2-digit' });
};






// new toast options trying because the old ones are not working

const BASE_OPTIONS = {
  position: "top-left",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
    transition: Fade,
    closeButton: false,
    limit: 1,
};




// different toast options for different types of messages


// export const showSuccessToast = (message) =>
//   toast(`${getCurrentTime()} - ${message}`, {
//     ...BASE_OPTIONS,
//     className: 'toast-success', // Custom class for success
//   });


// export const showToast = (message) =>
//   toast(` ${message}`, 
    
    
//     {
    
//     ...BASE_OPTIONS,

//     style: 
    
//     {
//       fontSize: '15px', // Smaller font
//       lineHeight: '1',  // Tighter line height
//       padding: '2px 8px', // Less vertical and horizontal padding
//       minHeight: 'auto', // Prevents default min-height from stretching the toast

//       backgroundColor: TOAST_COLORS.background,
//       color: TOAST_COLORS.text.success,

//       borderTopLeftRadius: '0px',
//       borderTopRightRadius: '50px',
//       borderBottomRightRadius: '50px',
//       borderBottomLeftRadius: '0px',

//       boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.01)', // X-offset, Y-offset, blur, transparency


//     },
//   });



// export const showToast = (message) => {
//   toast.dismiss(); // 👈 dismiss any existing toast immediately

//   toast(` ${message}`, {
//     ...BASE_OPTIONS,

//     style: {
//       fontSize: '15px',
//       lineHeight: '1',
//       padding: '2px 8px',
//       minHeight: 'auto',
//       backgroundColor: TOAST_COLORS.background,
//       color: TOAST_COLORS.text.success,
//       borderTopLeftRadius: '0px',
//       borderTopRightRadius: '50px',
//       borderBottomRightRadius: '50px',
//       borderBottomLeftRadius: '0px',
//       boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.01)',
//     },
//   });
// };



// globally scoped ID
const TOAST_ID = 'singleton';

export const showToast = (message) => {
  // If the toast already exists, just update it
  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, {
      render: message,
      autoClose: 1500,
    });
  } else {
    toast(message, {
      toastId: TOAST_ID,
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      transition: Fade,
      closeButton: false,
      style: {
        fontSize: '15px',
        lineHeight: '1',
        padding: '2px 8px',
        minHeight: 'auto',
        backgroundColor: TOAST_COLORS.background,
        color: TOAST_COLORS.text.success,
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '50px',
        borderBottomRightRadius: '50px',
        borderBottomLeftRadius: '0px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.01)',
      },
    });
  }
};

  

export const TOAST_OPTIONS =

{
  ...BASE_OPTIONS,

  style: {
    ...TOAST_STYLE,  
  },

};