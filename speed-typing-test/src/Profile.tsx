import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import axios from "axios";
import { format } from "date-fns";

const languageMap: { [key: string]: string } = {
  ru: "Русский",
  en: "Английский",
};

interface Result {
  id: number;
  user_id: number;
  wpm: number;
  accuracy: number;
  test_date: string;
  language: string;
  username: string;
}

const Profile: React.FC<{ username: string | null }> = ({ username }) => {
  const [topResults, setTopResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchTopResults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/results/top-results"
        );
        setTopResults(response.data);
      } catch (error) {
        console.error("Ошибка при получении топа результатов:", error);
      }
    };

    fetchTopResults();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "username", headerName: "Пользователь", width: 150 },
    { field: "wpm", headerName: "WPM", width: 100 },
    { field: "accuracy", headerName: "Точность", width: 100 },
    {
      field: "test_date",
      headerName: "Дата теста",
      width: 210,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value as string);
        return isNaN(date.getTime())
          ? "Invalid Date"
          : format(date, "dd.MM.yyyy HH:mm:ss");
      },
    },
    {
      field: "language",
      headerName: "Язык",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return languageMap[params.value as string] || params.value;
      },
    },
  ];

  return (
    <Box
      sx={{
        mt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ display: "inline-block" }}>
        Профиль пользователя {username}
      </Typography>
      <Typography variant="h5" sx={{ mt: 3 }}>
        Топ пользователей
      </Typography>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={topResults}
          columns={columns}
          paginationModel={{ pageSize: topResults.length || 10, page: 0 }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ width: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default Profile;