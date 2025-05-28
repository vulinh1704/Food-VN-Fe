import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { saveEvaluation } from '../../../services/evaluation-service/evaluation-service';
import { useUser } from '../../../providers/users/UserProvider';
import { useNotificationPortal } from '../../Supporter/NotificationPortal';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { storage } from '../../../config/fire-base';

const EvaluationForm = ({ productId, onEvaluationSubmitted }) => {
  const { user } = useUser();
  const { showNotification, NotificationPortal } = useNotificationPortal();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [hover, setHover] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        showNotification({
          type: 'error',
          message: `File ${file.name} has invalid format. Only JPEG, PNG, GIF are allowed`
        });
        return false;
      }
      if (file.size > maxSize) {
        showNotification({
          type: 'error',
          message: `File ${file.name} is too large. Maximum size is 5MB`
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const imagePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const id = v4();
          resolve({
            id,
            file: file,
            preview: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newImages = await Promise.all(imagePromises);
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const uploadImages = async () => {
    try {
      const uploadPromises = images.map(async (image) => {
        return new Promise((resolve, reject) => {
          const imageRef = ref(storage, `evaluations/${image.id}`);
          const uploadTask = uploadBytesResumable(imageRef, image.file);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(prev => ({ ...prev, [image.id]: progress }));
            },
            (error) => {
              console.error('Error uploading:', error);
              reject(error);
            },
            async () => {
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                setUploadProgress(prev => ({ ...prev, [image.id]: 100 }));
                resolve(url);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification({
        type: 'error',
        message: 'Please login to write a review'
      });
      return;
    }

    try {
      setIsUploading(true);
      let imageUrls = [];

      if (images.length > 0) {
        imageUrls = await uploadImages();
      }

      const evaluationData = {
        user: {
          id: user.id
        },
        product: {
          id: productId
        },
        score: rating,
        comment: comment,
        images: JSON.stringify(imageUrls)
      };

      await saveEvaluation(evaluationData);
      showNotification({
        type: 'success',
        message: 'Your review has been submitted successfully!'
      });

      setRating(5);
      setComment('');
      setImages([]);
      setUploadProgress({});

      if (onEvaluationSubmitted) {
        onEvaluationSubmitted();
      }
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'An error occurred while submitting your review'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <NotificationPortal />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  className="hidden"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  className="cursor-pointer transition-colors"
                  color={ratingValue <= (hover || rating) ? "#fecb02" : "#e4e5e9"}
                  size={24}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fecb02] focus:border-transparent"
          rows="4"
          placeholder="Share your thoughts about this product..."
          required
        />

        <div>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer bg-gray-100 px-4 py-2 rounded-md inline-block hover:bg-gray-200 transition-colors border border-gray-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Add Photos
          </label>
          <span className="ml-2 text-sm text-gray-500">
            (Max 5MB/photo, Format: JPEG, PNG, GIF)
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((image) => (
              <div key={image.id} className="relative">
                <div className="w-20 h-20 rounded-md border border-gray-300 overflow-hidden">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  {uploadProgress[image.id] !== undefined && uploadProgress[image.id] < 100 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="relative">
                        <AiOutlineLoading3Quarters className="w-6 h-6 text-white animate-spin" />
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-medium">
                          {Math.round(uploadProgress[image.id])}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImages(images.filter(img => img.id !== image.id));
                    setUploadProgress(prev => {
                      const newProgress = { ...prev };
                      delete newProgress[image.id];
                      return newProgress;
                    });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  disabled={isUploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`bg-[#fecb02] text-white px-6 py-2 rounded-md hover:bg-[#e5b700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fecb02] focus:ring-offset-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <AiOutlineLoading3Quarters className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </span>
          ) : 'Submit Review'}
        </button>
      </form>
    </>
  );
};

export default EvaluationForm; 