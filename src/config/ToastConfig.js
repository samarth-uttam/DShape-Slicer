

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






// the toast behavour is defined here 

export const BASE_OPTIONS = {
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







// globally scoped ID
const TOAST_ID = 'some_random_ID_for_Toast';

export const showToast = (message, onFirstToast = () => {}) => {
  // Call the passed-in callback (used to remove fake toast)
  onFirstToast();

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
        fontFamily: "'Montserrat', sans-serif", // 👈 Add this line

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