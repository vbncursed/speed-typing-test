import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
} from "react";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import axios from "axios";

const languageMap: { [key: string]: string } = {
  ru: "Русский",
  en: "Английский",
};

const SpeedTypingTest: React.FC = () => {
  const [language, setLanguage] = useState<string>("ru");
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [testWords, setTestWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [timer, setTimer] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const intervalRef = useRef<number | null>(null);
  const timeLeftRef = useRef<number>(timeLimit);
  const startTimeRef = useRef<number | null>(null);

  const endTest = useCallback(async () => {
    setTimer(false);
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
    }
    const inputWords = userInput.trim().split(" ");
    let correctChars = 0;
    let totalChars = 0;
    let correctWords = 0;

    for (let i = 0; i < inputWords.length; i++) {
      const word = inputWords[i];
      const testWord = testWords[i] || "";
      let wordCorrect = true;
      for (let j = 0; j < word.length; j++) {
        if (word[j] === testWord[j]) {
          correctChars++;
        } else {
          wordCorrect = false;
        }
      }
      if (wordCorrect && word.length === testWord.length) {
        correctWords++;
      }
      totalChars += testWord.length;
    }

    const accuracy = (correctChars / totalChars) * 100;
    const timeTaken = timeLimit - timeLeftRef.current;
    const wpm = timeTaken > 0 ? (correctWords / timeTaken) * 60 : 0;
    setResult(
      `Времени прошло: ${timeTaken.toFixed(
        2
      )} секунд\nТочность: ${accuracy.toFixed(
        2
      )}%\nСлов в минуту: ${wpm.toFixed(2)}\nЯзык: ${languageMap[language]}`
    );

    // Сохранение результата
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Не удалось сохранить результат: токен не найден");
        return;
      }

      const userResponse = await axios.get("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = parseInt(userResponse.data.id, 10);
      console.log(userId);

      await axios.post(
        "http://localhost:8000/results/save-result",
        {
          user_id: userId,
          wpm: wpm,
          accuracy: accuracy,
          language: language,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Результат сохранен успешно!");
    } catch (error) {
      console.error("Ошибка при сохранении результата:", error);
      alert("Ошибка при сохранении результата");
    }
  }, [userInput, testWords, timeLimit, language]);

  const updateTimer = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const timeLeft = timeLimit - Math.floor(elapsed / 1000);
      if (timeLeft >= 0) {
        setTimeLeft(timeLeft);
        timeLeftRef.current = timeLeft;
        intervalRef.current = requestAnimationFrame(updateTimer);
      } else {
        setTimeLeft(0);
        endTest();
      }
    },
    [timeLimit, endTest]
  );

  useEffect(() => {
    if (timer) {
      intervalRef.current = requestAnimationFrame(updateTimer);
    }
    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
      }
    };
  }, [timer, updateTimer]);

  const startTest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Не удалось начать тест: необходима регистрация");
      return;
    }

    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
    }
    setTestWords([]);
    setUserInput("");
    setResult("");
    timeLeftRef.current = timeLimit;
    setTimeLeft(timeLimit);
    setTimer(true);

    const response = await fetch(
      `http://localhost:8000/test/start-test?language=${language}`
    );
    const data = await response.json();
    setTestWords(data.words);
  };

  const checkInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (e.target.value.split(" ").length === testWords.length) {
      endTest();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Speed Typing Test
        </Typography>
        <Paper
          elevation={3}
          sx={{ padding: "20px", marginBottom: "20px", borderRadius: "16px" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Выберите язык:</Typography>
              <Select
                fullWidth
                value={language}
                onChange={(e) => setLanguage(e.target.value as string)}
                sx={{ borderRadius: "16px" }}
              >
                <MenuItem value="ru">Русский</MenuItem>
                <MenuItem value="en">Английский</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Выберите лимит времени:</Typography>
              <Select
                fullWidth
                value={timeLimit}
                onChange={(e) =>
                  setTimeLimit(parseInt(e.target.value as string))
                }
                sx={{ borderRadius: "16px" }}
              >
                <MenuItem value={10}>10 секунд</MenuItem>
                <MenuItem value={20}>20 секунд</MenuItem>
                <MenuItem value={30}>30 секунд</MenuItem>
                <MenuItem value={60}>60 секунд</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={startTest}
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                  fontWeight: "bold",
                  fontSize: "16px",
                  padding: "10px 20px",
                }}
              >
                Начать тест
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Box mt={2} mb={2}>
          <Typography variant="h6" id="timer">
            Время до конца: {timeLeft} секунд
          </Typography>
        </Box>
        <Box mb={2} id="test-words">
          <Typography variant="body1">{testWords.join(" ")}</Typography>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Начните печатать здесь..."
          value={userInput}
          onChange={checkInput}
          disabled={!timer}
          sx={{ borderRadius: "16px" }}
        />
        {result && (
          <Box mt={2}>
            <Typography variant="body1">{result}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SpeedTypingTest;
