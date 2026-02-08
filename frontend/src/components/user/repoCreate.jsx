import React, { useState } from 'react';
import Profile from './Profile.jsx';
import './repoCreate.css';

const RepoCreatePage = ({ user }) => {
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const visibilityBoolean = visibility === 'public'; // convert to boolean

    try {
      const response = await fetch('http://localhost:3000/apiRepo/repo/create', { // backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // if using cookies for auth
        body: JSON.stringify({
          owner: user._id, // logged-in user id
          name: repoName,
          description,
          visibility: visibilityBoolean,
          issues: [],
          content: [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Repository "${repoName}" created successfully!`);
        setRepoName('');
        setDescription('');
      } else {
        setMessage(data.error || 'Failed to create repository.');
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div>
      <Profile user={user} />
      <h2 className="header">Create a New Repository</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="repoName">Repository Name:</label>
          <input
            type="text"
            id="repoName"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label htmlFor="visibility">Visibility:</label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button className="createrepButton" type="submit">Create Repository</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default RepoCreatePage;
