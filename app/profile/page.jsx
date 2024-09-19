"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (session?.user.id) {
      const fetchPosts = async () => {
        const response = await fetch(`/api/users/${session.user.id}/posts`);
        const data = await response.json();

        setMyPosts(data);
      };

      fetchPosts();
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user.id) {
    return <div>You need to be signed in to view this page.</div>;
  }

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt");

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id}`, { method: "DELETE" });

        const filteredPosts = myPosts.filter((p) => p._id !== post._id);
        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
