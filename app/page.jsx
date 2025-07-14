"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LandingPage() {
  const router = useRouter();

  const startQuiz = () => {
    router.push("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center quiz-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">Timed Quiz</CardTitle>
          <CardDescription className="text-lg font-normal text-gray-600 dark:text-gray-300">
            Test your knowledge with this timed quiz. Your score will be
            displayed at the end!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={startQuiz}
            className="mt-4 px-8 py-3 text-lg quiz-button"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
