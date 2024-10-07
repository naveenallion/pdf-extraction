import React, { useState, useEffect, useCallback } from "react";
import {
  IoCloudUploadOutline,
  IoAddOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

export default function Home() {
  // Define types for selectedFiles and uploadedFiles
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection and automatically start upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
    }
    setUploadProgress({});
    setIsUploading(false);
  };

  // Simulate file upload with fake progress for each file
  const simulateUpload = useCallback(() => {
    setIsUploading(true);
    const filesArray = Array.from(selectedFiles || []);

    filesArray.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;

        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: progress,
        }));

        if (progress >= 100) {
          clearInterval(interval);
          setUploadedFiles((prevFiles) => [...prevFiles, file]);

          if (index === filesArray.length - 1) {
            setIsUploading(false);
            setSelectedFiles(null);
          }
        }
      }, 500);
    });
  }, [selectedFiles]);

  // Automatically trigger upload when files are selected
  useEffect(() => {
    if (selectedFiles) {
      simulateUpload();
    }
  }, [selectedFiles, simulateUpload]);

  // Remove a file from the uploaded files list
  const handleRemoveUploadedFile = (index: number): void => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#F2F2F2]">
      <div className="bg-white p-6 rounded space-y-4">
        <h3 className="w-full text-center pb-4 font-medium">Upload PDF File</h3>

        {/* Wrap the upload area in a label and hide the input */}
        <label htmlFor="file-upload" className="cursor-pointer">
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="application/pdf"
            multiple // Allow multiple file selection
          />
          <div className="border-solid border-2 border-dashed p-2 py-4 border-[#cdcdcd] space-y-4 rounded">
            <div className="flex w-full justify-center text-xl">
              <IoCloudUploadOutline />
            </div>
            <p className="text-center max-w-[270px] w-full">
              Browse and choose the files you want to upload from your computer
            </p>
            <div className="flex w-full justify-center">
              <div className="bg-[#047857] text-white p-2 rounded">
                <IoAddOutline />
              </div>
            </div>
          </div>
        </label>

        {/* Display selected files and upload progress */}
        {selectedFiles && (
          <>
            <h2 className="font-medium">
              Uploading - {selectedFiles.length} file(s)
            </h2>
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center">
                  <p className="w-full">{file.name}</p>
                  {/* You can uncomment this block if you wish to allow removing selected files */}
                  {/* <IoCloseCircleOutline
                    className="text-[20px] text-black/60 hover:text-red-500 duration-300"
                    onClick={() => handleRemoveFile(file)}
                  /> */}
                </div>

                {/* Progress Bar for each file */}
                {isUploading && (
                  <div className="h-[4px] bg-black/10 rounded">
                    <div
                      className="h-full bg-primary duration-300"
                      style={{
                        width: `${uploadProgress[file.name] || 0}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Display uploaded files */}
        {uploadedFiles.length > 0 && (
          <>
            <h2 className="font-medium">Uploaded Files</h2>
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <div className="flex items-center" key={index}>
                  <p className="w-full">{file.name}</p>
                  <IoCloseCircleOutline
                    className="text-[20px] text-black/60 hover:text-red-500 duration-300"
                    onClick={() => handleRemoveUploadedFile(index)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* "Next" Button */}
        {uploadedFiles.length > 0 && (
          <div className="bg-primary w-full p-2 px-4 flex justify-center text-white rounded hover:bg-hover duration-300 hover:cursor-pointer">
            Next
          </div>
        )}
      </div>
    </div>
  );
}
