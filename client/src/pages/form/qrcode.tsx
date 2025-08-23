import type { QRCodeComponentProps } from "../../types";
import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import { tokens } from "../../theme";

// Use QRCodeComponentProps from types.d.ts

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  id = null,
  download = true,
  print = true,
  send = true,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Generate QR Code URL
  const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
    id ?? ""
  }`;

  // Function to handle printing the image
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html lang="en">
        <head>
          <title>QR Code</title>
          <style>
            body { 
              display: flex; 
              flex-direction: column; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0; 
              font-family: Arial, sans-serif;
            }
            .print-container {
              text-align: center;
              padding: 20px;
              border: 2px solid #ccc;
              border-radius: 16px;
              background-color: #f9f9f9;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            img {
              max-width: 100%; 
              max-height: 100%; 
              border: 4px solid #fff; 
              border-radius: 16px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            h1 {
              margin-bottom: 20px;
              font-size: 24px;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h1>Your QR Code</h1>
            <img id="qrImage" src="${imageUrl}" alt="QR Code" />
          </div>
          <script>
            const img = document.getElementById('qrImage');
            img.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Function to handle downloading the image
  const handleDownload = async () => {
    const response = await fetch(imageUrl, { mode: "cors" });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // clean up
  };

  const handleSend = () => {
    const subject = "QR Code";
    const body = `Here is your QR code: ${imageUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={4}
    >
      {/* QR Code Placeholder */}
      <Box
        width="300px"
        height="300px"
        sx={{
          bgcolor: colors.primary[500],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          boxShadow: 3,
          border: `4px solid ${colors.primary[700]}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={imageUrl}
          alt="QR Code"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
      </Box>

      {/* Buttons under QR Code */}
      <Box mt={3} display="flex" gap={2}>
        {print && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
        )}
        {download && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
        )}
        {send && (
          <Button
            variant="contained"
            color="success"
            startIcon={<SendIcon />}
            onClick={handleSend}
          >
            Send
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default QRCodeComponent;
