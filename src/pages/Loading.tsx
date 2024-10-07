import React from "react";

export default function Loading() {
  return (
    <div className="bg-background h-screen w-screen flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <h3>PDF file is Scanning</h3>
      </div>
    </div>
  );
}
