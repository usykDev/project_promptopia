"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const router = useRouter();

  const { data: session } = useSession(); // we renamed data to the session

  const searchParams = useSearchParams();
  const name = searchParams.get("name"); // getting id value from query
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
    <Suspense fallback={<div>Loading...</div>}>
      <Profile
        name={name[0].toUpperCase() + name.substring(1)}
        desc={`Welcome to ${name}'s profile page`}
        data={userPosts}
      />
    </Suspense>
  );
};

export default UserProfile;
