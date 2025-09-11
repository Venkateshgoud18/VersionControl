import React ,{use, useEffect,useState}from 'react';
import './dashboard.css';
import Profile from '../user/Profile.jsx';
const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQueries, setSearchQueries] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [starredRepos, setStarredRepos] = useState([]);

    const userId = localStorage.getItem("userId");

    const fetchStarredRepos = async () => {
        const userId = localStorage.getItem("userId");
        try {
          const res = await fetch(`http://localhost:3000/apiRepo/repo/starred/${userId}`);
          if (res.ok) {
            const data = await res.json();
            setStarredRepos(data);
          }
        } catch (err) {
          console.error("Error fetching starred repos:", err);
        }
      };
      const handleStarRepo = async (repoId) => {
        try {
          const userId = localStorage.getItem("userId");
          const response = await fetch(`http://localhost:3000/apiRepo/repo/star/${repoId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
          });
      
          if (response.ok) {
            await fetchStarredRepos(); 
          }
        } catch (err) {
          console.error("Error starring repo:", err);
        }
      };
    useEffect(()=>{
        const userId=localStorage.getItem("userId");

        const fecthRepositories=async()=>{
            try{
                const responce=await fetch(`http://localhost:3000/apiRepo/repo/user/${userId}`);
                if(responce.ok){
                    const data=await responce.json();
                    setRepositories(data);
                }else{
                    console.error("Failed to fetch repositories");
                }
            }
            catch(err){
                console.error("Error fetching repositories:", err);
            }

    };
    const fecthSuggestedRepositories=async()=>{
        try{
            const responce=await fetch(`http://localhost:3000/apiRepo/repo/all`);
            if(responce.ok){
                const data=await responce.json();
                setSuggestedRepositories(data);
            }else{
                console.error("Failed to fetch repositories");
            }
        }
        catch(err){
            console.error("Error fetching repositories:", err);
        }

};

  
  
  
    fetchStarredRepos();
    fecthRepositories();
    fecthSuggestedRepositories();
},[]);

    useEffect(() => {
        if (searchQueries=="") {
            setSearchResults(repositories);
        }
        else{
            const filteredRepos=repositories.filter(repo=> repo.name.toLowerCase().includes(searchQueries.toLowerCase()));
            setSearchResults(filteredRepos);

        }
    },[searchQueries, repositories]);

    return (
      <><Profile />
        <section id="dashboard">
            <aside>
                <h2>Suggested Repos</h2>
                {suggestedRepositories.map((repo)=>(
                    <div key={repo._id}>
                        <h3>{repo.name}</h3>
                        <p>{repo.description}</p>
                        <button onClick={()=>handleStarRepo(repo._id)}>
                            {starredRepos.some(starredRepo => starredRepo._id === repo._id) ? "Unstar" : "Star"}
                        </button>
                    </div>
                    
                )) }
                
            </aside>
            <aside>
  <h2>Starred Repos</h2>
  {starredRepos.length > 0 ? (
    starredRepos.map((repo) => (
      <div key={repo._id}>
        <h3>{repo.name}</h3>
        <p>{repo.description}</p>
      </div>
    ))
  ) : (
    <p>No starred repos yet</p>
  )}
</aside>

            <main>
            <h2>Your Repos</h2>
            <div className='seach-box'>
                <input 
                type="text" 
                placeholder='Search Repositories...' 
                value={searchQueries}
                onChange={(e)=>setSearchQueries(e.target.value)}
                />
            </div>
                {searchResults.map((repo)=>(
                    <div key={repo._id}>
                        <h3>{repo.name}</h3>
                        <p>{repo.description}</p>
                    </div>
                ))}
            </main>
            <aside className="upcoming">
  <h2>Upcoming Events</h2>

  <div className="events-scroller">
    <ul className="events-list">
      {/* original items */}
      <li><p>Tech – Conference Dec 15</p></li>
      <li><p>Developer – Conference Dec 15</p></li>
      <li><p>AI – Conference Dec 15</p></li>

      {/* duplicate once for seamless looping */}
      <li><p>ML – Conference Dec 15</p></li>
      <li><p>Blockchain – Conference Dec 15</p></li>
      <li><p>Marketing – Conference Dec 15</p></li>
    </ul>
  </div>
</aside>

        </section>
      </>
    )
}
export default Dashboard;