import React from "react";
import { IoCloudUploadOutline, IoAddOutline } from "react-icons/io5";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#F2F2F2]">
      <div className="bg-white p-4 px-6 rounded">
        <h3 className="w-full text-center pb-4 font-medium">Upload PDF File</h3>
        <div className="border-solid border-2 border-dashed p-2 py-4 border-[#cdcdcd] space-y-4 rounded">
          <div className="flex w-full justify-center text-xl">
            <IoCloudUploadOutline />
          </div>
          <p className="text-center max-w-[270px] w-full">
            Browse and chose the files you want to upload from your computer
          </p>
          <div className="flex w-full justify-center">
            <div className="bg-[#047857] text-white p-2 rounded">
              <IoAddOutline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
