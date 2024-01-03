import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [url,setUrl] = useState('http://hn.algolia.com/api/v1/search?query=foo&tags=story');
  const [isPending, setIsPending] = useState(true);
  const [errorMessage,setErrorMessage] = useState(null)

useEffect( () => {
  setErrorMessage('')
},[])

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          setErrorMessage('Could not fetch the data for that resource.');
          throw Error('Could not fetch the data for that resource.');
        }
        return res.json()
      })
      .then((data) => {
        setNews(data.hits);
        setIsPending(false);
      })
      .catch((error) => setErrorMessage(error.message));
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let link = `http://hn.algolia.com/api/v1/search?query=${searchItem}&tags=story`
    setUrl(link);
  };

  const handlePrompt = (e) => {
    setSearchItem(e.target.value);
  };

  return (
    <>
      <h1>Hacker News</h1>

      <form>
        <label htmlFor="search">Search Articles</label><br />
        <input type="text" id="search" onChange={handlePrompt} /><button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      { errorMessage && <div> {errorMessage} </div>}
      { isPending && !errorMessage && <div>Loading News ...</div>}
      { searchItem !== '' && news.length === 0 && <div>No Articles found for "{searchItem}". Please try another keyword.</div>}
      
      {news && news.map((post) => (
        <div className="posts">
          <h2 className="post__title"> {post.title} </h2>
          <p className="post__author">
          <em>written by {post.author} at {post.created_at}
            </em>
          </p>
          <p className="post__link">
            <a href={post.url} target="_blank">Read more</a>
          </p>
        </div>
      ))}
    </>
  );
}

export default App;
