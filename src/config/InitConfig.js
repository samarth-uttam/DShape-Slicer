// src/config/InitConfig.js

import { color } from "three/tsl";


// scene color details 

export const INITIAL_SCENE_COLOR = '#eeeeee';
export const DARK_SCENE_COLOR = '#111111';



// camera position and target detail
export const HOME_CAMERA_POSITION = [43, 48, 27];
export const HOME_CAMERA_TARGET = [2, 12, -8];
export const HOME_CAMERA_FOV = 50;
export const HOME_CAMERA_NEAR = 0.1;
export const HOME_CAMERA_FAR = 1000;




//initial Build plate details

const INITIAL_BUILD_PLATE_x  = 20
const INITIAL_BUILD_PLATE_y  = 40
const INITIAL_BUILD_PLATE_z  =10 



// TOAST COLORS 

export const TOAST_COLORS = {
  background: 'rgba(177, 170, 170, 0)',      // already in rgba
  success: 'rgba(193, 255, 38, 1)',
  error: 'rgba(234, 67, 53, 1)',
  info: 'rgba(66, 133, 244, 1)',
  text: {
    success: 'rgb(81, 76, 76)',
    error: 'rgba(10, 10, 10, 1)',
    info: 'rgba(10, 10, 10, 1)',
  },
};





export const TOAST_STYLE = {
  // fontSize: '5px',
 
  minHeight: 'unset',

  width: 'fit-content',
  maxWidth: '80vw',
  minWidth: '100px',
  
  wordWrap: 'break-word',
  display: 'inline-block',
  
  color : 'red'
};


export const TOAST_CONTAINER_STYLE = {
  top: '115px',
  left: '15px',
  right: 'auto',
  bottom: 'auto',
  position: 'fixed',
  zIndex: 9999,
};

