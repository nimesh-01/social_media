import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import defaultProfile from "/default_profile_img.jpg";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownPostId, setDropdownPostId] = useState(null);
  const fileInputRef = useRef();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${backendUrl}/api/user`, {
          withCredentials: true,
        });

        const data = res.data.userData;
        setUserData(data);
        setUserPosts(res.data.userPosts);

        if (data.profile_img && data.profile_img !== "") {
          setProfileImage(data.profile_img);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownPostId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setIsLoading(true);

      const res = await axios.post(
       `${backendUrl}/api/upload-profile-pic`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileImage(res.data.imageUrl);
      setUserData((prev) => ({
        ...prev,
        profile_img: res.data.imageUrl,
      }));
    } catch (error) {
      console.error("Failed to upload profile image", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    console.log(postId);

    try {
      setIsLoading(true);
      await axios.delete(`${backendUrl}/api/posts/${postId}`, {
        withCredentials: true,
      });

      setUserPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setDropdownPostId(null);
      setIsLoading(false);
    }
  };

  const toggleDropdown = (postId) => {
    setDropdownPostId(dropdownPostId === postId ? null : postId);
  };

  return (
    <>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#212A31]/70 backdrop-blur-sm flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#D3D9D4] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="min-h-screen bg-[#D3D9D4] py-10 px-4 flex justify-center">
        <div className="w-full max-w-5xl bg-[#212A31] text-[#D3D9D4] rounded-xl shadow-lg p-6 md:p-10">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-[#748D92] pb-6">
            {/* Profile Picture */}
            <div
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#124E66] cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-top object-cover"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold">
                {userData?.fname} {userData?.lname}
              </h2>
              <p className="text-[#748D92] text-sm md:text-base mt-1">
                @{userData?.username}
              </p>
              <p className="text-[#748D92] text-sm md:text-base">
                {userData?.email_id}
              </p>
              <p className="mt-2 text-sm md:text-base font-semibold text-[#D3D9D4]">
                {userPosts.length} {userPosts.length === 1 ? "Post" : "Posts"}
              </p>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="relative bg-[#2E3944] border border-[#124E66] rounded-lg overflow-hidden"
              >
                {/* Three-dot menu */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => toggleDropdown(post._id)}
                    className="text-white text-lg hover:scale-110 transition-transform"
                  >
                    ⋮
                  </button>
                  {dropdownPostId === post._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-28 bg-white text-[#212A31] shadow-md rounded-md py-1 z-20"
                    >
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                </div>

                <img
                  src={post.image}
                  alt="Post"
                  className="w-full object-contain"
                  style={{ aspectRatio: "1 / 1" }}
                />
                <div className="text-xs text-[#D3D9D4] px-2 py-2 break-words">
                  {post.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
