import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import cookingIcon from "../assets/svg/cooking2.svg";

export default function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  // return a promise
  const onSubmitDetails = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const onChangeDetails = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmitDetails();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "ProfileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChangeDetails}
            ></input>
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "ProfileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChangeDetails}
            ></input>
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={cookingIcon} alt="home" />
          <p className="">Add new item into categories!</p>
          <img src={arrowRight} alt="arrowright" />
        </Link>
      </main>
    </div>
  );
}
