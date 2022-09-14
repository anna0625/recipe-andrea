import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { toast } from "react-toastify";

export const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "quick-and-easy",
    name: "",
    time: 10,
    servings: 1,
    ingredients_str: "",
    steps_str: "",
    imageUrls: {},
    sourceURL: "",
    offer: false,
    restaurant: "",
    location: "",
    latitude: 0,
    longitude: 0,
    userRef: "",
  });

  const {
    type,
    name,
    time,
    servings,
    steps_str,
    ingredients_str,
    sourceURL,
    offer,
    restaurant,
    location,
    imageUrls,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (imageUrls.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }

    let geolocation = {};
    let restaurantAddress;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );

      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      restaurantAddress =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (restaurantAddress === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address");
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      restaurantAddress = location;
    }

    setLoading(false);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    //   Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">quick-and-easy / baking</label>
          <div className="formButtons">
            <button
              type="button"
              className={
                type === "quick-and-easy" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="quick-and-easy"
              onClick={onMutate}
            >
              Quick-and-Easy
            </button>
            <button
              type="button"
              className={type === "baking" ? "formButtonActive" : "formButton"}
              id="type"
              value="baking"
              onClick={onMutate}
            >
              Baking
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="40"
            minLength="3"
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Servings</label>
              <input
                className="formInputSmall"
                type="number"
                id="servings"
                value={servings}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Time (mins)</label>
              <input
                className="formInputSmall"
                type="number"
                id="time"
                value={time}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Ingredients</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="ingredients_str"
            value={ingredients_str}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Steps</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="steps_str"
            value={steps_str}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Source</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="sourceURL"
            value={sourceURL}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className="formLabel">Restaurant Found</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          {offer && (
            <>
              <label className="formLabel">Restaurant Name</label>
              <input
                className="formInputName"
                type="text"
                id="restaurant"
                value={restaurant}
                onChange={onMutate}
                maxLength="32"
                minLength="1"
                required={offer}
              />

              <label className="formLabel">Location</label>
              <textarea
                className="formInputAddress"
                type="text"
                id="location"
                value={location}
                onChange={onMutate}
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="imageUrls"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg,.heic"
            multiple
            required
          />

          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
};
