import { useState } from 'react';

const ReadMoreParagraph = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text) return null;
  const isLongText = text.length > 100;

  return (
    <div>
      <p
        className={`transition-all duration-300 ${
          isExpanded ? '' : 'line-clamp-3'
        }`}
      >
        {text}
      </p>
      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
        >
          {isExpanded ? 'Read less' : 'Read more >>'}
        </button>
      )}
    </div>
  );
};

export default ReadMoreParagraph;