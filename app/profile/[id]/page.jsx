"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "User";
  console.log("name", name);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();

      setUserPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, []);

  return (
    <Profile
      name={name[0].toUpperCase() + name.substring(1)}
      desc={`Welcome to ${name}'s profile page`}
      data={userPosts}
    />
  );
};

export default UserProfile;
