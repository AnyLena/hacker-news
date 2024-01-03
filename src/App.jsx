import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [url, setUrl] = useState(
    "http://hn.algolia.com/api/v1/search?query=foo&tags=story"
  );
  const [isPending, setIsPending] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [page,setPage] =useState(0);

  useEffect(() => {
    setErrorMessage("");
  }, []);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          setErrorMessage("Could not fetch the data for that resource.");
          throw Error("Could not fetch the data for that resource.");
        }
        return res.json();
      })
      .then((data) => {
        setNews(data.hits);
        setIsPending(false);
      })
      .catch((error) => setErrorMessage(error.message));
  }, [url]);

  useEffect(() => {
    let link = `http://hn.algolia.com/api/v1/search?query=${searchItem}&tags=story&page=${page}`;
    setUrl(link)
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    let link = `http://hn.algolia.com/api/v1/search?query=${searchItem}&tags=story&page=${page}`;
    setUrl(link);
  };

  const handlePrompt = (e) => {
    setSearchItem(e.target.value);
  };

  const handleNext = () => {
    setPage( oldPage => oldPage + 1)
  }
  const handlePrevious = () => {
    setPage( oldPage => Math.max(oldPage - 1,0))
  }

  return (
    <>
      <h1>Hacker News</h1>

      <form>
        <label htmlFor="search">Search Articles</label>
        <br />
        <input type="text" id="search" onChange={handlePrompt} />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      <section className="pagination"> 
      
      { page !== 0 && <button onClick={handlePrevious}>{` < Previous Page`}</button> }
      <button onClick={handleNext}>{`Next Page > `}</button>
      

      </section>

      {errorMessage && <div> {errorMessage} </div>}
      {isPending && !errorMessage && <div>Loading News ...</div>}
      {searchItem !== "" && news.length === 0 && (
        <div>
          No Articles found for "{searchItem}". Please try another keyword.
        </div>
      )}

      {news &&
        news.map((post) => {
          const date = new Date(post.created_at);
          const formattedDate = date.toLocaleDateString("en-EN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
          return (
            <div className="posts">
              <h2 className="post__title"> {post.title} </h2>
              <p className="post__author">
                <em>
                  written by {post.author} on {formattedDate}{" "}
                </em>
              </p>
              <p className="post__link">
                <a href={post.url} target="_blank">
                  Read more
                </a>
              </p>
            </div>
          );
        })}
    </>
  );
}

export default App;
