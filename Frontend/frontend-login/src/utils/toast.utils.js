import toast from 'react-hot-toast';

export const createToast = (response, successMessage = 'Operation completed successfully', errorMessage = 'Operation failed') => {
    if (response && response.success === false) {
        // API returned an error response
        const message = response.message || errorMessage;
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
            },
        });
    } else if (response && response.success === true) {
        // API returned a success response
        const message = response.message || successMessage;
        toast.success(message, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#dcfce7',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
            },
        });
    } else if (response && response.data) {
        // API returned data (implicit success)
        toast.success(successMessage, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#dcfce7',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
            },
        });
    } else {
        // Fallback for unexpected response format
        toast.error(errorMessage, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
            },
        });
    }
};

export const showSuccessToast = (message) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#dcfce7',
            color: '#16a34a',
            border: '1px solid #bbf7d0',
        },
    });
};

export const showErrorToast = (message) => {
    toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #fecaca',
        },
    });
};

export const showLoadingToast = (message) => {
    return toast.loading(message, {
        position: 'top-right',
    });
};

export const updateToast = (toastId, type, message) => {
    if (type === 'success') {
        toast.success(message, { id: toastId });
    } else if (type === 'error') {
        toast.error(message, { id: toastId });
    }
};
