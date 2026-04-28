import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFeedback } from '../../api/FeedbackService';
import { X, CheckCircle, Star } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        try {
            await submitFeedback(rating, comment);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal">
                <button className="feedback-close-btn" onClick={onClose}><X size={20} /></button>
                
                {isSuccess ? (
                    <div className="feedback-success">
                        <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                        <h3>{t('feedback.successTitle')}</h3>
                        <p>{t('feedback.successMessage')}</p>
                    </div>
                ) : (
                    <>
                        <h2 className="feedback-title">{t('feedback.title')}</h2>
                        <p className="feedback-subtitle">{t('feedback.subtitle')}</p>

                        <div className="feedback-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-8 h-8 cursor-pointer transition-colors ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>

                        <textarea
                            className="feedback-textarea"
                            placeholder={t('feedback.placeholder')}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={1000}
                        />

                        <div className="feedback-actions">
                            <button className="btn-skip" onClick={onClose} disabled={isSubmitting}>
                                {t('feedback.skip')}
                            </button>
                            <button 
                                className="btn-submit" 
                                onClick={handleSubmit} 
                                disabled={rating === 0 || isSubmitting}
                            >
                                {isSubmitting ? t('feedback.submitting') : t('feedback.submit')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;
