"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import questionsData from "@/data/questions.json";

export default function ScorePage() {
  const router = useRouter();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const storedScore = localStorage.getItem("quizScore");
    if (storedScore) {
      setScore(Number.parseInt(storedScore, 10));
    }
  }, []);

  const retakeQuiz = () => {
    localStorage.removeItem("quizScore"); // Clear score for retake
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center quiz-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">
            Quiz Completed!
          </CardTitle>
          <CardDescription className="text-lg font-normal text-gray-600 dark:text-gray-300">
            Your final score is:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-6">
            {score} / {questionsData.length}
          </div>
          <Button
            onClick={retakeQuiz}
            className="mt-4 px-8 py-3 text-lg quiz-button"
          >
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
