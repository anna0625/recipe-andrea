// The listing of he specific category items that inside the category page.
// Thus, we revice props from pages/Category.jsx

import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import personIcon from "../assets/svg/person2.svg";
import timerIcon from "../assets/svg/timer.svg";

export const ListingItem = ({ listing, id }) => {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.sourceURL}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingPrice">
            {listing.offer
              ? "📍 " + listing.restaurant
              : "restaurant not found"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={personIcon} alt="prep" />
            <p className="categoryListingInfoText">
              {listing.servings > 1
                ? `${listing.servings} servings`
                : "1 servings"}
            </p>
            <img src={timerIcon} alt="cooking" />
            <p className="categoryListingInfoText">{listing.time} mins</p>
          </div>
        </div>
      </Link>

      {/* {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231, 76, 60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )} */}
    </li>
  );
};
