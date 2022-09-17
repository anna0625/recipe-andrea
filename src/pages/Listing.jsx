// /category/${listing.type}/${docRef.id}

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { Spinner } from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";

export const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <main>
        {/* SLIDER */}
        <div
          className="shareIconDiv"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
              setShareLinkCopied(false);
            }, 2000);
          }}
        >
          <img src={shareIcon} alt="shareIcon" />
        </div>
        {shareLinkCopied && <p className="linkCopied">Link Copied</p>}
        <div className="listingDetails">
          <p className="listingName">
            {listing.name}
            {listing.offer ? " - " + listing.restaurant : ""}
          </p>
          {listing.offer && (
            <p className="listingLocation">{listing.location}</p>
          )}
          <p className="listingType">
            For{" "}
            {listing.type === "quick-and-easy" ? "Quick and Easy" : "Baking"}
          </p>
          <p className="listingType">{listing.time + "mins"}</p>
          <p className="listingType">
            {listing.servings === 1
              ? `${listing.servings} serving`
              : `${listing.servings} servings`}
          </p>
          <ul className="listingDetailsList">
            <p className="listingLocationTitle">Ingredients</p>
            <li>{listing.ingredients_str}</li>
            <p className="listingLocationTitle">Steps</p>
            <li>{listing.steps_str}</li>
          </ul>

          {listing.offer && <p className="listingLocationTitle">Location</p>}
          {/* MAP */}

          {auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
              className="primaryButton"
            >
              Contact Creator
            </Link>
          )}
        </div>
      </main>
    </>
  );
};
