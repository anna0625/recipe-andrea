// /category/${listing.type}/${docRef.id}

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Spinner } from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
SwiperCore.use([Navigation, Pagination, Autoplay, Scrollbar, A11y]);

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
        console.log(docSnap.data());
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
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={true}
        >
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="swiperSlideDiv">
                <img
                  src={url}
                  alt=""
                  style={{
                    objectFit: "cover",
                    width: "100vw",
                    height: "40vh",
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

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

          {listing.offer && (
            <>
              <p className="listingLocationTitle">Location</p>
              <div className="leafletContainer">
                <MapContainer
                  style={{ height: "100%", width: "100%" }}
                  center={[listing.geolocation.lat, listing.geolocation.lng]}
                  zoom={18}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                  />

                  <Marker
                    position={[
                      listing.geolocation.lat,
                      listing.geolocation.lng,
                    ]}
                  >
                    <Popup>{listing.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </>
          )}
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
