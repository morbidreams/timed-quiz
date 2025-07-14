"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import questionsData from "@/data/questions.json";

export default function QuizPage() {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(questionsData[0]?.tempsAlloue || 0);
  const [selectedValue, setSelectedValue] = useState("");
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questionsData[questionIndex];

  // Initialize timer when question changes
  useEffect(() => {
    if (currentQuestion) {
      setTimer(currentQuestion.tempsAlloue);
      setSelectedValue(""); // Clear selected answer for new question
    }
  }, [questionIndex, currentQuestion]);

  // Timer countdown logic
  useEffect(() => {
    if (quizCompleted) return;

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          // Time's up for current question or last question
          clearInterval(countdown);
          handleNextQuestion();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, questionIndex, quizCompleted]); // Depend on timer and questionIndex

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timer % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timer]);

  const handleAnswerChange = (value) => {
    setSelectedValue(value);
  };

  const handleNextQuestion = useCallback(() => {
    // Save the answer for the current question before moving
    const isCorrect = selectedValue === currentQuestion?.bonneReponse;
    const points = isCorrect ? currentQuestion?.points : 0;

    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentQuestion?.question,
        reponse: selectedValue,
        resultat: points,
      },
    ]);

    if (questionIndex < questionsData.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  }, [questionIndex, selectedValue, currentQuestion, questionsData.length]);

  // Redirect to score page when quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      const totalScore = answers.reduce((sum, ans) => sum + ans.resultat, 0);
      localStorage.setItem("quizScore", totalScore);
      router.push("/score");
    }
  }, [quizCompleted, answers, router]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading quiz...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 quiz-card">
        <CardHeader className="pb-5">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl font-bold flex-grow pr-4">
              {currentQuestion.question}
            </CardTitle>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
              {formatTime()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedValue}
            onValueChange={handleAnswerChange}
            className="grid gap-3"
          >
            {currentQuestion.choix.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerChange(option)}
                className="radio-label"
                data-state={
                  selectedValue === option ? "selected" : "unselected"
                }
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="w-full cursor-pointer text-lg"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-end pt-6">
            <Button
              onClick={handleNextQuestion}
              className="flex items-center gap-1 px-6 py-3 text-lg quiz-button"
              disabled={!selectedValue && timer > 0} // Disable if no answer selected and time is not up
            >
              {questionIndex === questionsData.length - 1 ? "Finish" : "Next"}
              <KeyboardArrowRightIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
