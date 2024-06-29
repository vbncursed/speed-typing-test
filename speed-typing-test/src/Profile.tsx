import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [topResults, setTopResults] = useState<Result[]>([]);
  const [userResults, setUserResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchTopResults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/results/top-results"
        );
        setTopResults(response.data);
      } catch (error) {
        console.error(`Ошибка при получении топа результатов: ${error}`);
      }
    };

    const fetchUserResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/results/user-results?username=${username}`
        );
        const sortedResults = response.data.sort(
          (a: Result, b: Result) =>
            new Date(a.test_date).getTime() - new Date(b.test_date).getTime()
        );
        setUserResults(sortedResults);
      } catch (error) {
        console.error(
          `Ошибка при получении результатов пользователя: {}`,
          error
        );
      }
    };

    fetchTopResults();
    fetchUserResults();
  }, [username]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID результата", width: 120 },
    { field: "username", headerName: "Пользователь", width: 120 },
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
          : format(date, "dd.MM.yy HH:mm");
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
      <Box sx={{ width: "100%", height: 400, mt: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={userResults}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="test_date"
              tickFormatter={(tick) => format(new Date(tick), "dd.MM.yy HH:mm")}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="wpm"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
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
