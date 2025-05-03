import { useState } from "react";
import { FaStar } from "react-icons/fa";

function RatingStars({ onRate, initialRating = 0 }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <FaStar
            key={index}
            className={`cursor-pointer text-2xl ${
              ratingValue <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => {
              setRating(ratingValue);
              onRate(ratingValue);
            }}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
}

export default RatingStars;
