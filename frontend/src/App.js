import * as React from 'react';
import { useState, useEffect } from 'react';
import Map, { Marker, Popup, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './app.css';
import axios from "axios";
import {format} from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import SimpleImageSlider from "react-simple-image-slider";
import RoomTwoToneIcon from '@mui/icons-material/RoomTwoTone';
import FmdGoodTwoToneIcon from '@mui/icons-material/FmdGoodTwoTone';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RoomIcon from '@mui/icons-material/Room';

function App() {

  const myStorage = window.localStorage;

  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));;

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [showPopup, setShowPopup] = React.useState(true);

  const [viewState, setViewState] = useState({
    // width: "70vh",
    // height: "100vh",
    latitude: 36.8189700,
    longitude: 10.1657900,
    zoom: 12
  });
    
  useEffect(() => {
    const getPins = async ()=> {
      try {
        const res = await axios.get("http://localhost:8800/api/pins/");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getPins();
  }, []);

  // When the user click on a marker
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    // Commenting this out
    setViewState({...viewState, latitude: lat, longitude: long});
  }
  
  const handleAddClick = (e) => {
    // const [long, lat] = e.lngLat; // this is before
    const long = e.lngLat.lng;
    const lat = e.lngLat.lat;

    setNewPlace({
      lat,
      long,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: "skanderlahbaiel",
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
      
    }
    try {
      const res = await axios.post("http://localhost:8800/api/pins/", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  }
  
  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <Header/>
      <Map
        {...viewState}
        style={{width: "100vw", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={"pk.eyJ1Ijoic2thbmRlcmxhaGJhaWVsIiwiYSI6ImNscmo0bXRsZjBiZGIyanA5cDBvcDF5d3IifQ.terMwhXIWvRjF379IFNxCA"}
        onMove={evt => setViewState(evt.viewState)}
        onDblClick={handleAddClick}
        // transitionDuration="2000"
      >
        {pins.map(p => (
          <>
          <Marker 
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewState.zoom*1.5}
            offsetTop={-viewState.zoom*3}
          >
            <RoomIcon
              style={{
                fontSize: viewState.zoom * 3, 
                color: p.username === currentUser ? "slateblue" : "tomato", 
                cursor: "pointer"}}
              onClick={()=>handleMarkerClick(p._id, p.lat, p.long)}
              stroke={"#707070"} stroke-width={0.4}
            />
          </Marker>
          {p._id === currentPlaceId && (
            // <Popup 
            //   latitude={p.lat}
            //   longitude={p.long}
            //   closeButton={true}
            //   closeOnClick={false}
            //   onClose={() => setCurrentPlaceId(null)}
            //   anchor="left"
            // >
            <div className="popup">
              <div className="card">
                <h3 className="place">{p.title}</h3>
                <p className="desc">{p.desc}</p>

                <div>
                  <a href={"https://maps.google.com/?q=" + p.address} target="_blank"><div className="info"><img className="icons" src="./pin.svg"></img>{p.address}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></a>
                  <div className="info"><img className="icons" src="./star.svg"></img>{p.rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <div className="info"><img className="icons" src="./clock.svg"></img>{p.hours}&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <div className="info"><img className="icons" src="./phone.svg"></img>{p.phone}</div>
                </div>

                <div className="picture">
                  <SimpleImageSlider
                    width={300}
                    height={225}
                    images={p.image}
                    showNavs={true}
                    navSize={30}
                    navMargin={10}
                    loop={false}
                    // showBullets={true}
                  />
                </div>

                <label>Review</label>
                <p className="desc">{p.review}</p>

                <label>Ratings</label>
                <p>Cleanliness: &nbsp;&nbsp;{Array(p.cleanliness).fill("🧻")}</p>
                <p>Comfort: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Array(p.comfort).fill("💩")}</p>
                <p>Vibes: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Array(p.vibes).fill("💅")}</p>

                <label>Information</label>
                <span className="username">Created by <b>{p.username}</b></span>
                <span className="date">{format(p.createdAt)}</span>

                <div className="tags">
                  {p.tags.map((tag) => <div className="tag">{tag}</div>)}
                </div>
              </div>
            {/* </Popup> */}
            </div>
            )
          }
          </>
        ))}
        {newPlace && (<Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setCurrentPlaceId(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input 
                placeholder="Enter the name of the animal" 
                onChange={(e)=>setTitle(e.target.value)}
              /> 

              <label>Description</label>
              <input 
                placeholder="Enter the description of the animal" 
                onChange={(e)=>setTitle(e.target.value)}
              />

              <label>Infos</label>
              <textarea 
                placeholder="Tell us something about the animal." 
                onChange={(e)=>setDesc(e.target.value)}
              />

              <label>Health</label>
              <select onChange={(e)=>setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Animal</button>
            </form>
          </div>
        </Popup>
        )}
        {/* {currentUser ? (
          <button className="button logout" onClick={handleLogout}>Log out</button>
        ) : (
          <div className="buttons">
            <button 
              className="button login" 
              onClick={() => setShowLogin(true)}>
                Login
            </button>
            <button 
              className="button register"
              onClick = {() => setShowRegister(true)}>
                Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login 
            setShowLogin={setShowLogin} 
            myStorage={myStorage} 
            setCurrentUser={setCurrentUser}
          />
        )} */}
        {/* Filters */}
        {/* <div className={currentPlaceId ? "filters active" : "filters"}>
          <button className="filter all">All</button>
          <button className="filter public"></button>
          <button className="filter restaurant">🍕 Food</button>
          <button className="filter accessible">☕️ Coffee</button>
          <button className="filter accessible">♿️</button>
        </div> */}

        <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            position={'top-left'}
            showUserLocation={true}
            showUserHeading={true}
          />
      </Map>
    </div>
  );
}

export default App;
