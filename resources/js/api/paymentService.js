import API from './apiClient';

export const saveTransaction = (data) => {
    return API.post('/payment/transaction', data);
};

export const getUserTransactions = () => {
    return API.get('/payment/transactions');
};

export const requestRefund = (data) => {
    return API.post('/payment/refund', data);
};
