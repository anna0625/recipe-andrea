import React from "react";
import { Link } from "react-router-dom";
import bakingCategoryImage from "../assets/jpg/baking.jpg";
import cookingCategoryImage from "../assets/jpg/cooking.jpg";
import { Slider } from "../components/Slider";
import { SearchBar } from "../components/SearchBar";

export default function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>

      <main>
        <SearchBar />

        <Slider />

        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/quick-and-easy">
            <img
              src={cookingCategoryImage}
              alt="quick-and-easy"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Quick and Easy</p>
          </Link>
          <Link to="/category/baking">
            <img
              src={bakingCategoryImage}
              alt="baking"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Baking</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
