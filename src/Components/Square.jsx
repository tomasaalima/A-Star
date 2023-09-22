import React from "react";

function Square(props) {
  const { value } = props;

  return (
    <div className="w-6 h-6 border text-gray-800 flex flex-row justify-center items-center font-extrabold text-xs">
      {value === 9 ? "" : value}
    </div>
  );
}

export default Square;