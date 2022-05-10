import React, { useState, useEffect } from 'react';

// Component for the movies on the front page
const Movie = () => {
  // State variables to verify and store the api call
  const [api, setApi] = useState([{text: 'initial api'}]);
  const [render, setRender] = useState([false]);


  let resultsInitial = [];
  let resultsTranslated = [];
  let images = [];
  
  // Function for the translate api from the original language of Spanish to English
  const apiTranslate = (endpoint) => {
    const axios = require("axios");

    const encodedParams = new URLSearchParams();
    encodedParams.append("q", String(endpoint));
    encodedParams.append("target", "en");
  
    const options = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
        'X-RapidAPI-Key': '8979142300msh09e792c8546de4dp1cdc6bjsn7ccd34f83e4b'
      },
      data: encodedParams
    };
  
    axios.request(options).then(function (response) {
      resultsTranslated.push(response.data.translations[0].translatedText)
    }).catch(function (error) {
      console.error(error);
    });

  }

  // Function to search for movies from a genre using an api call 
  const apiMovie = (endpoint) => {
    
    const axios = require("axios");

    const options = {
      method: 'GET',
      url: 'https://advanced-movie-search.p.rapidapi.com/discover/movie',
      params: {with_genres: String(endpoint), page: '1'},
      headers: {
        'X-RapidAPI-Host': 'advanced-movie-search.p.rapidapi.com',
        'X-RapidAPI-Key': '8979142300msh09e792c8546de4dp1cdc6bjsn7ccd34f83e4b'
      }
    };
    
    // Substitute the api array with the new 
    axios.request(options).then(function (response) {
    images.push(response.data.results[0].poster_path);
    }).catch(function (error) {
    console.error(error);
    });
  }

  // Using useEffect hook to deal with asynchronous api calls
  useEffect(() => {
    const axios = require("axios");
           
    const options = {
      method: 'GET',
        url: 'https://movies-app1.p.rapidapi.com/api/genres',
        headers: {
          'X-RapidAPI-Host': 'movies-app1.p.rapidapi.com',
          'X-RapidAPI-Key': '8979142300msh09e792c8546de4dp1cdc6bjsn7ccd34f83e4b'
        }
      };
        
    // Storing api information in the state variable 
    axios.request(options).then(function (response) {
    response.data.results.forEach((element) => {
    setApi(response.data);
    setRender(true);
    const movie = `
                  <div class="card">
                  <div class="left-side"
                  <h2> ${element.name} </h2>
                  </div>
                  </div>`;
    });
    
    }).catch(function (error) {
      console.error(error);
    });

    // Takes genre and passes it to the translate api
    resultsInitial.forEach((element) => {
      apiTranslate(element);
    });

    // Takes the translated genre and passes it to the search api
    resultsTranslated.forEach((element) => {
      apiMovie(element);
    })
  }, []);

  let x = 0; 
  for (x; x < api.results.length; x++) {
    resultsInitial.push(api.results[x].name);
  }

  return (
    // Displays the different movies from the array along iwth the images
    <div className="total">      
    <div className="movies"
    dangerouslySetInnerHTML={{__html: resultsTranslated}}/>
    <div>
      {images.forEach((element, index) => {
      <a>
        <img className="best-movies" src={`${images[index]}`}
        width="150" height="70"/>
      </a>
      })}
    </div>
    </div>
    )    
};

export default Movie;