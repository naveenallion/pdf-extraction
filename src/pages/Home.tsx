import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  IoCloudUploadOutline,
  IoAddOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false); // State to manage sending status
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
      setUploadProgress({});
      setIsUploading(false);
    }
  };

  // Simulate file upload with fake progress
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

  // Handle clicking on the upload button or box
  const handleUploadClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle the "Next" button click to send the uploaded files to the API
  const handleNextClick = async (): Promise<void> => {
    if (uploadedFiles.length === 0) return;

    setIsSending(true); // Set the sending state to true when request starts
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file); // append each file with key "files"
    });

    try {
      const response = await axios.post(
        "https://pdf-extractor-api-middleware-beta.vercel.app/v1/uploader",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsSending(false); // Set the sending state back to false when request ends
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
      }}
    >
      <Paper sx={{ padding: 4, borderRadius: 2 }} elevation={0}>
        <Typography variant="h6" textAlign="center" pb={2}>
          Upload PDF File
        </Typography>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          hidden
          onChange={handleFileUpload}
          accept="application/pdf"
          multiple // Allow multiple file selection
        />

        <Box
          sx={{
            border: "2px dashed #ebeae8",
            padding: 2,
            py: 4,
            textAlign: "center",
            cursor: "pointer",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleUploadClick} // Trigger upload on box click
        >
          <IoCloudUploadOutline size={30} />
          <Typography variant="body1" my={2}>
            Browse and choose the files you want <br /> to upload from your computer
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleUploadClick}
            sx={{
              width: "40px",
              height: "40px",
              minWidth: "unset",
              padding: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IoAddOutline size={30} />
          </Button>
        </Box>

        {/* Display selected file and upload progress */}
        {selectedFiles && (
          <>
            <Typography variant="subtitle1" fontWeight={600} mt={2}>
              Uploading - {selectedFiles.length} file(s)
            </Typography>

            {/* Scrollable box for uploading files */}
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "hidden",
                "&:hover": {
                  overflowY: "auto",
                },
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              {Array.from(selectedFiles).map((file, index) => (
                <Box display="flex" alignItems="center" mt={2} key={index}>
                  <Typography flexGrow={1}>{file.name}</Typography>
                </Box>
              ))}
            </Box>

            {/* Progress Bar */}
            {isUploading && (
              <Box sx={{ width: "100%", mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress[selectedFiles[0]?.name] || 0}
                  color="success"
                />
              </Box>
            )}
          </>
        )}

        {/* Display uploaded files in scrollable box */}
        {uploadedFiles.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight={600} mt={2}>
              Uploaded Files
            </Typography>
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "hidden",
                "&:hover": {
                  overflowY: "auto",
                },
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              {uploadedFiles.map((file, index) => (
                <Box display="flex" alignItems="center" mt={1} key={index}>
                  <Typography flexGrow={1}>{file.name}</Typography>
                  <IconButton onClick={() => handleRemoveUploadedFile(index)}>
                    <IoCloseCircleOutline className="text-[20px] text-black/60 hover:text-red-500 duration-300" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* "Next" Button */}
        {uploadedFiles.length > 0 && (
          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={handleNextClick} // Trigger file upload to API
            disabled={isSending} // Disable button while sending
          >
            {isSending ? "Sending files..." : "Next"} {/* Toggle button text */}
          </Button>
        )}
      </Paper>
    </Box>
  );
}
