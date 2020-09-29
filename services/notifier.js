import Noty from 'noty';

// alert, success, warning, error, info/information
// top, topLeft, topCenter, topRight, center, centerLeft, centerRight, bottom, bottomLeft, bottomCenter, bottomRight
const notif = function(text, type, timeout = 2000) {
  if('string' != typeof text) {
    return false;
  }

  return  new Noty({
    text: text,
    theme: 'relax',
    type: type,
    timeout: timeout
  }).show();
}

export const Notifier = {
  debug: (text, element) => {
    // notif(text, 'warning');
    console.warn('-- DEBUG: '+text, element);
  },
  log: (text, element) => {
    // notif(text, 'info');
    // console.log('-- LOG: '+text, element);
  },
  info: (text, element) => {
    notif(text, 'info');
    console.info('-- INFO: '+text, element);
  },
  warn: (text, element) => {
    notif(text, 'warning');
    console.warn('-- WARN: '+text, element);
  },
  error: (text, element) => {
    if (element && element.message) {
      notif(text+' - '+element.message, 'error');
    } else {
      notif(text, 'error');
    }
    console.error(text, element);
  }
};
