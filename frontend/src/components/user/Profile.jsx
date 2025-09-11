import React from "react";
import { Link } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  return (
    <nav>
      <Link to="/">
        <div>
          <img 
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
            alt="GitHub Logo" 
            className="logo"
          />
          <h3>GitHub</h3>
        </div>
      </Link>
      <div>
        <Link to="/create">+ Create a repo</Link>
        <Link to="/profile">Profile</Link>  
      </div>
    </nav>
  );
};

export default Profile;
