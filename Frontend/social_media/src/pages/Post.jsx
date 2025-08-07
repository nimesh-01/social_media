import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Post = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setFileData(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setFileData(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handlePost = async () => {
    if (!fileData) {
      toast.error("No image selected. Please select an image to post.");
      return;
    }

    const formData = new FormData();
    formData.append('Image', fileData);

    try {
      setIsLoading(true);

      const res = await axios.post(`${backendUrl}/api/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success('Post uploaded successfully!');
        setSelectedImage(null);
        setFileData(null);
        navigate('/');
      } else {
        toast.error('Unexpected server response. Please try again.');
      }

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || 'Server error. Try again.');
      } else if (error.request) {
        toast.error('No response from server. Check your connection.');
      } else {
        toast.error('Error: ' + error.message);
      }
      console.error("Post Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#212A31]/70 backdrop-blur-sm flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#D3D9D4] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-[#D3D9D4] p-4">
        <div className="w-full max-w-xl bg-[#212A31] rounded-lg shadow-lg p-6 space-y-6">
          <div
            onDrop={handleImageDrop}
            onDragOver={handleDragOver}
            onClick={() => inputRef.current?.click()}
            className="w-full h-80 border-2 border-dashed border-[#748D92] rounded-lg flex items-center justify-center bg-[#2E3944] cursor-pointer hover:border-[#124E66] transition"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            ) : (
              <p className="text-[#D3D9D4] text-center">
                Drag & Drop or Click to Select an Image
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            onClick={handlePost}
            disabled={isLoading}
            className="w-full bg-[#124E66] text-[#D3D9D4] py-3 rounded-md font-semibold hover:bg-[#0d3d52] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Post;
