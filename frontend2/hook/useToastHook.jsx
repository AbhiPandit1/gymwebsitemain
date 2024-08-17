import { toast } from 'react-toastify';

const useToastHook = () => {
  const showToast = (message, type = 'default') => {
    let toastOptions = {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      className: 'default-toast',
      bodyClassName: 'default-toast-body',
    };

    switch (type) {
      case 'success':
        toastOptions.className = 'bg-blue-500 text-white';
        toastOptions.bodyClassName = 'text-white';
        break;
      case 'error':
        toastOptions.className = 'bg-gray-700 text-gray-200';
        toastOptions.bodyClassName = 'text-gray-200';
        break;
      default:
        break;
    }

    toast(message, toastOptions);
  };

  return { showToast };
};

export default useToastHook;
