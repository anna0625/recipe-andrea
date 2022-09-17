import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import cookingIcon from "../assets/svg/cooking2.svg";
import { ListingItem } from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where(
          "userRef",
          "==",
          auth.currentUser.uid,
          orderBy("timestamp", "desc")
        )
      );

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

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

  const onDeleteItem = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(() => listings.id !== listingId);
      setListings(updatedListings);
      toast.success("Successfully delete the recipe");
    }
  };

  const onEditItem = (listingId) => navigate(`/edit-listing/${listingId}`);

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

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Recipes</p>
            <ul className="listingList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onEdit={() => onEditItem(listing.id)}
                  onDelete={() => onDeleteItem(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
