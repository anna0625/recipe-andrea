import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "../components/Spinner";
import { toast } from "react-toastify";

export const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "quick-and-easy",
    name: "",
    time: 10,
    servings: 1,
    ingredients_str: "",
    steps_str: "",
    images: {},
    sourceURL: "",
    offer: false,
    restaurant: "",
    address: "",
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
    images,
    offer,
    restaurant,
    address,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  // fix memery leakage
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

  //===================== onSubmit Start ====================
  const onSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }

    // ----------------- Geolocation -----------------------
    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );

      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || address.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address");
      }
    }
    // } else {
    //   //   geolocation.lat = latitude;
    //   //   geolocation.lng = longitude;
    //   //   restaurantAddress = address;
    // }

    // ----------------- Firebase Storage -----------------------
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              default:
                console.log("This is default");
                break;
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    // ----------------- Firebase Firestore -----------------------
    try {
      const formDataCopy = {
        ...formData,
        imageUrls,
        geolocation,
        timestamp: serverTimestamp(),
      };

      formDataCopy.location = address;
      delete formDataCopy.images;
      delete formDataCopy.address;
      // !formDataCopy.offer && delete formDataCopy.restaurant;
      // !formDataCopy.offer && delete formDataCopy.address;

      const docRef = await addDoc(collection(db, "listings"), formDataCopy);
      setLoading(false);
      toast.success("Listing saved!");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  //===================== onSubmit End ====================

  //===================== onMutate Start ====================
  const onMutate = (e) => {
    let boolean = null;

    // for some forms to display or not
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // ----------------- enable geolocation -----------------------
    if (e.target.id === "offer" && e.target.value === "false") {
      setGeolocationEnabled(false);
    }
    if (e.target.id === "offer" && e.target.value === "true") {
      setGeolocationEnabled(true);
    }

    // ----------------- update FormData with images -----------------------
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
  //===================== onMutate End ====================

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          {/* Categories */}
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
          {/* Name of the dish */}
          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="100"
            minLength="3"
            required
          />

          <div className="formRooms flex">
            {/* Servings */}
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
            {/* Time */}
            <div>
              <label className="formLabel">Time (mins)</label>
              <input
                className="formInputSmall"
                type="number"
                id="time"
                value={time}
                onChange={onMutate}
                min="1"
                max="1000"
                required
              />
            </div>
          </div>

          {/* Ingredients */}
          <label className="formLabel">Ingredients</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="ingredients_str"
            value={ingredients_str}
            onChange={onMutate}
            required
          />

          {/* Steps */}
          <label className="formLabel">Steps</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="steps_str"
            value={steps_str}
            onChange={onMutate}
            required
          />

          {/* Source from the website */}
          <label className="formLabel">Source</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="sourceURL"
            value={sourceURL}
            onChange={onMutate}
            required
          />

          {/* Manual geolocation */}
          {/* {!geolocationEnabled && (
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
          )} */}

          {/* Related to offer, which means the user found the restaurant that sells the dish */}
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

          {/* Restaurant Name & Address (location in the db) */}
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

              <label className="formLabel">Address</label>
              <textarea
                className="formInputAddress"
                type="text"
                id="address"
                value={address}
                onChange={onMutate}
                required={offer}
              />
            </>
          )}

          {/* Images (haven't set the rule in db */}
          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
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
