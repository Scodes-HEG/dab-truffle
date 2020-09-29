import Vue from 'vue';

export const LOADER_EVENT = new Vue();

export const LOADER_TURN_ON = () => {
  LOADER_EVENT.$emit('on');
};
export const LOADER_TURN_OFF = () => {
  LOADER_EVENT.$emit('off');
};
