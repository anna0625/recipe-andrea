/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

export const Contact = () => {
  const [message, setMessage] = useState("");
  const [creator, setCreator] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getCreator = async () => {
      const docRef = doc(db, "users", params.creatorId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setCreator(docSnapshot.data());
      } else {
        toast.error("Could not get creator info.");
      }
    };
    getCreator();
  }, [params.creatorId]);

  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Creator</p>
      </header>

      {creator !== null && (
        <main>
          <div className="contactLoadlord">
            <p className="landlordName">Contact {creator?.name}</p>
          </div>

          <form className="massageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${creator.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button className="primaryButton" type="button">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};
