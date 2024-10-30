import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useStore } from '../lib/store';

interface RatingModalProps {
  deliveryId: string;
  toUserId: string;
  onClose: () => void;
  userType: 'client' | 'messenger';
}

export default function RatingModal({ deliveryId, toUserId, onClose, userType }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const updateDelivery = useStore((state) => state.updateDelivery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ratingData = {
      rating,
      comment,
      userId: toUserId,
      timestamp: new Date().toISOString(),
    };

    updateDelivery(deliveryId, {
      status: 'completed',
      ...(userType === 'client' 
        ? { messengerRating: ratingData }
        : { clientRating: ratingData }
      ),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Califica tu experiencia
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hover || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Cuéntanos tu experiencia..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!rating}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar calificación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}