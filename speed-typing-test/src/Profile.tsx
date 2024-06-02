import React from "react";
import { Box, Typography } from "@mui/material";

const Profile: React.FC<{ username: string | null }> = ({ username }) => {
  return (
    <Box
      sx={{
        mt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Центрирование по вертикали
        textAlign: "center", // Центрирование текста
      }}
    >
      <Typography variant="h4" sx={{ display: "inline-block" }}>
        Профиль пользователя {username}
      </Typography>
    </Box>
  );
};

export default Profile;
