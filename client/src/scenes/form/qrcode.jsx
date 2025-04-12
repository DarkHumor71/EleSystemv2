import React from "react";
import {Box, Button, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useLocation, useNavigate} from "react-router-dom";

const Qrcode = () => {
    const theme = useTheme();
    const location = useLocation();
    const id = location.state;
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    // Replace this with the actual path to your image
    const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`;

    // Function to handle printing the image
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
    <html>
      <head>
        <title>Print QR Code</title>
        <style>
          body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          img { max-width: 100%; max-height: 100%; }
        </style>
      </head>
      <body>
        <img src="${imageUrl}" alt="QR Code" />
      </body>
    </html>
  `);
        printWindow.document.close();
        printWindow.print();
    };

    // Function to handle downloading the image
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "qrcode.png"; // The name of the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            justifyContent="flex-start"
            height="80vh"
            position="relative"
            pt={8}
        >
            {/* QR Code Placeholder */}
            <Box
                width="300px"
                height="300px"
                bgcolor={colors.primary[500]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="16px"
                boxShadow={3}
            >
                <img
                    src={imageUrl}
                    alt="QR Code"
                    style={{maxWidth: "100%", maxHeight: "100%", borderRadius: "16px"}}
                />
            </Box>

            {/* Buttons under QR Code */}
            <Box mt={3} display="flex" gap={2}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PrintIcon/>}
                    onClick={handlePrint}
                >
                    Print
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DownloadIcon/>}
                    onClick={handleDownload}
                >
                    Download
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<SendIcon/>}
                    onClick={handleSend}
                >
                    Send
                </Button>
            </Box>

            {/* Back Button in Bottom-Left */}
            <Button
                variant="outlined"
                color="error"
                startIcon={<ArrowBackIcon/>}
                sx={{position: "absolute", bottom: 20, left: 20}}
                onClick={() => navigate("/create_apartment")}
            >
                Back
            </Button>
        </Box>
    );
};

export default Qrcode;
