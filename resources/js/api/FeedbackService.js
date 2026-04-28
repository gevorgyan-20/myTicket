import axios from 'axios';

export const submitFeedback = async (rating, comment) => {
    return await axios.post('/api/feedback', {
        rating,
        comment,
    });
};
