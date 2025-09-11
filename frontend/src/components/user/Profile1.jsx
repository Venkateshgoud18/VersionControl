// Profile1.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Profile"; // You can rename Profile.jsx -> Navbar.jsx
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import Heatmap from "./Heatmap"; // Import the Heatmap component
import { Link } from "react-router-dom";
import "./profile1.css";

const Profile1 = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!userId) return console.error("No userId found in localStorage!");

    const fetchData = async () => {
      try {
        // Fetch user profile
        const userRes = await axios.get(`http://localhost:3000/api/profile/${userId}`);
        if (userRes.status === 200) setUserData(userRes.data);

        // Fetch user repositories
        const repoRes = await axios.get(`http://localhost:3000/apiRepo/repo/user/${userId}`);
        if (repoRes.status === 200) setRepositories(Array.isArray(repoRes.data) ? repoRes.data : []);

        // Fetch starred repositories
        const starRes = await axios.get(`http://localhost:3000/apiRepo/repo/starred/${userId}`);
        if (starRes.status === 200) setStarredRepos(Array.isArray(starRes.data) ? starRes.data : []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) {
    return <p>Please log in to view your profile.</p>;
  }

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <div className="user-info">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="User Avatar"
            className="avatar"
          />
          <h2>{userData?.username || "Unknown User"}</h2>
<p>{userData?.email || ""}</p>

        </div>

        <div className="nav-bar">
          <div className="underline-nav">
            <button className="nav-link selected">Overview</button>
            <button className="nav-link">
              <RepoIcon /> Repositories <span className="counter">{repositories.length}</span>
            </button>
            <button className="nav-link">
              <BookIcon /> Starred <span className="counter">{starredRepos.length}</span>
            </button>
          </div>
        </div>

        <div className="repo-list">
          {repositories.length > 0 ? (
            repositories.map((repo) => (
              <div
                key={repo._id}
                className="repo-item"
                onClick={() => navigate(`/repo/${repo._id}`)}
              >
                <h3>{repo.name}</h3>
                <p>{repo.description}</p>
              </div>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </div>
        <div className="starred-list">
          <h2>Starred Repositories</h2>
          {starredRepos.length > 0 ? (
            starredRepos.map((repo) => (
              <div
                key={repo._id}
                className="repo-item"
                onClick={() => navigate(`/repo/${repo._id}`)}
              >
                <h3>{repo.name}</h3>
                <p>{repo.description}</p>
              </div>
            ))
          ) : (
            <p>No starred repositories found.</p>
          )}
        </div>
          <button onClick={()=>{ localStorage.removeItem("token"); localStorage.removeItem("userId"); setCurrentUser(null);
          navigate("/login");
          }} style={{position:"absolute", top:"10px", right:"10px"}} id="logout">Logout</button>
        <Heatmap
  values={[
    { date: "2025-04-01", count: 2 },
    { date: "2025-04-02", count: 5 }
  ]}
/>


      </div>
    </>
  );
};

export default Profile1;
