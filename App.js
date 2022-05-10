import logo from "./logo.svg";
import "./App.css";
import React, {useState} from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import Movie from './components/Movie';
import { HashRouter, NavLink } from "react-router-dom";
import { Route, Link, useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Main App Component
const App = () => {
  // Set State variables for the search bar and the api call
  const [text, setText] = useState([{text: ''}]);
  const [api, setApi] = useState([{text: 'initial api'}]);

  // Display date
  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;    
  };

  // Function for the call of the movie data
  const apiMovie = (endpoint) => {
    const axios = require("axios");

    const options = {
    method: 'GET',
    url: 'https://advanced-movie-search.p.rapidapi.com/search/movie',
    params: {query: String(endpoint), page: '1'},
    headers: {
      'X-RapidAPI-Host': 'advanced-movie-search.p.rapidapi.com',
      'X-RapidAPI-Key': '8979142300msh09e792c8546de4dp1cdc6bjsn7ccd34f83e4b'
    }
  };

  // Save the api in a state variable
  axios.request(options).then(function (response) {
	setApi(response.data);
  }).catch(function (error) {
	console.error(error);
  });
  }

  // Takes answer input in search box
  const getInputValue = (e) => {
    setText(e.target.value);
  }

  const navigate = useNavigate();

  // Saves the inputted result, redirects to the page and makes the api call
  const activeSubmit = (e) => {
    navigate(`/search${text}`);
    e.preventDefault();
    setApi(apiMovie(text));
  }

  // Create an array of functions with html and return statements to then call after a specific button/image click with specific information
  let functions = [];
  (api.results).forEach((element, index) => {
    const imageClick = () => {
      navigate(`/search${text}/${element.title}`);
      const movie = `<div className=image-display>
                    <li className="title">${element.title}<li>
                    <img src=${element.poster_path}/>
                    <div className="description">Released on: ${element.release_date} in ${element.original_language}</div> 
                    <p className="description">${element.overview}</p>
                    </div>`;
      
    return (
      <Router>
        <Routes>
          <Route path = {`/search${text}/${element.title}`} element = {
                {`${movie}`}
           }/>
        </Routes>
      </Router>
    )}    
    functions.push(imageClick());
  })

  return (
    // Display front page
    <div className="app">
      <main>
        <h1 className="title">Movies Searching Site</h1>
          <div className="search-box">
            <input type="text" className="search-bar" placeholder="Search..." onChange={getInputValue}/>
            {/* Take search and save it using event handler */}
            <button className="submit-box" onClick={activeSubmit}>Submit</button>
          </div>
        <div className="information-box">
          <div className="description">This is a movies information website. Use the search bar to search for a movie or look below.</div>
          <hr/>
          <div className="date">{dateBuilder(new Date())}</div>
        </div>
        <div>
          <Movie />
        </div>
        
        {/* Displays the closest movies to the search as image buttons and then registers the click */}
        {/* Redirects to the same function in the array corresponding to that movie using the index variable */}
        <Router>
          <Routes>
            <Route path = {`/search${text}`} element={
              <div className="search-movies">
                {(api.results).forEach((element, index) => {
                  <div className="movie">
                    <h2 className="description">
                      {`${((api.results)[index]).overview}`}
                    </h2>
                    <a>
                      <button className="image-button" onClick={functions[index]}><img src={`${((api.results)[index]).poster_path}`}
                      width="150" height="70"/></button>
                    </a>
                  </div>
                })}
              </div>
            }/>
          </Routes>
        </Router>
      </main>
    </div>
  );
};

export default App;