import React, {useEffect, useState, useRef} from 'react';
import './App.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [tabArray, setTabArray] = useState([1, 2, 3, 4]);
  const [tabIndex, setTabIndex] = useState(0);
  const currentTabIndicatorRef = useRef();
  let transition = {
    0: "0px",
    1: "70px",
    2: "127px",
    3: "183px"
  };
  useEffect(()=>{
    const fetchAllAlbums = ()=>{
      return fetch("https://jsonplaceholder.typicode.com/albums/")
      .then(res=>res.json())
      .then(data=>{
        setAlbums(data);
      });
    }
    fetchAllAlbums()
    .then(()=>{
      fetch("https://jsonplaceholder.typicode.com/users")
      .then(res=>res.json())
      .then(data=>{
        setUsers(data);
        setIsLoaded(true);
      });
    })
  }, [])
  useEffect(()=>{
    if(isLoaded){
      const md = albums.map(album=>{
        const user = users.find(user=>user.id===album.userId);
        return {...album, userName: user.name};
      });
      setMergedData(md);
    }
  }, [isLoaded, albums, users])
  const handlePreviousClick = ()=>{
    if(currentPage === 1){
      return;
    }
    if(tabIndex===0){
      currentTabIndicatorRef.current.style.transform = `translate3d(${transition[3]}, 0px, 0px)`;
      const newTabArray = [];
      for(let i=currentPage-4; i<=currentPage-1;i++){
        newTabArray.push(i);
      }
      setTabArray(newTabArray);
      setTabIndex(3);

    }
    else if(tabIndex===1){
      currentTabIndicatorRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
      setTabIndex(cs=>cs-1);
    }
    else{
      currentTabIndicatorRef.current.style.transform = `translate3d(${transition[tabIndex-1]}, 0px, 0px)`;
      setTabIndex(cs=>cs-1);
    }
    setStartIndex((currentState)=>currentState-itemsPerPage);
    setCurrentPage(cs=>cs-1);
  }
  const handleNextClick = ()=>{
    if(currentPage === Math.ceil(mergedData.length/itemsPerPage)){
      return;
    }
    if(tabIndex===3){
      currentTabIndicatorRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
      const newTabArray = [];
      for(let i=currentPage+1; i<=currentPage+4;i++){
        newTabArray.push(i);
      }
      setTabArray(newTabArray);
      setTabIndex(0);
    }
    else{
      currentTabIndicatorRef.current.style.transform = `translate3d(${transition[tabIndex+1]}, 0px, 0px)`;
      setTabIndex(cs=>cs+1);
    }
    setStartIndex((currentState)=>currentState+itemsPerPage);
    setCurrentPage(cs=>cs+1);
  }
  return (
    <div className="App">
      {
        isLoaded&&mergedData.length!==0
        ?
        <>
          <div className="userList">
            <h2 style={{"margin": "1.5rem 0rem"}}>
              LIST OF ALBUMS
            </h2>
            {
              mergedData.slice(startIndex, startIndex + itemsPerPage).map(item=>(
                <div className="userCard" key={item.id}>
                  <div className="cardComponent">
                    <span className="tagline">ALBUM TITLE: </span><div className="content">{item.title}</div>
                  </div>
                  <div className="cardComponent">
                    <span className="tagline">User: </span><div className="content">{item.userName}</div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="footer">
            <div className="button" onClick={handlePreviousClick}>
              Previous
            </div>
            <div className="pageMonitor">
              <div className="tabWrapper">
                {
                    tabArray.map((tabItem, index)=>{
                        if(index===0){
                          return (
                            <span key={index} style={{position: "relative", padding: "8px 2px", width: "40px", display: "inline-flex", justifyContent: "center", alignItems: "center"}}>
                              <span className="tabArrayElement" style={{color: tabItem===currentPage?"white":"black"}}>{tabItem}
                              </span>
                              <div className="currentTabIndicator" ref={currentTabIndicatorRef}>
                              </div>
                            </span>
                          )
                        }
                        else{
                          return <span key={index} className="tabArrayElement"  style={{color: tabItem===currentPage?"white":"black"}}>{tabItem}</span>
                        }
                        })
                }
              </div>
            </div>
            <div className="button" onClick={handleNextClick}>
              Next
            </div>
          </div>
        </>
        :
        <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <h1>
            Loading...
          </h1>
        </div>
      }
    </div>
  );
}

export default App;
