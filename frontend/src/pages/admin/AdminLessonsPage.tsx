import { useEffect, useState } from "react";
import type { Lesson, LessonListItem, Question } from "@/types";

import { LessonList } from "@/features/admin/components/LessonList";
import { LessonEditor } from "@/features/admin/components/LessonEditor";
import { StatusModal } from "@/features/admin/modals/StatusModal";
import { ConfirmDeleteModal } from "@/features/admin/modals/ConfirmDeleteModal";
import { lessonService } from "@/shared/services/lessonService";

export function AdminLessonsPage() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: 0,
    title: "",
    book: "Gênesis",
    level: 1,
    questions: [],
  });
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterBook, setFilterBook] = useState("");
  const [filterLevel, setFilterLevel] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (view === "list") void fetchLessons();
  }, [view]);

  const fetchLessons = async () => {
    try {
      const res = await lessonService.getLessons();
      setLessons(res.data);
    } catch {
      console.error("Erro ao carregar lições");
    }
  };

  const filteredLessons = lessons?.filter(
    (l) =>
      l.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
      (filterBook === "" || l.book === filterBook) &&
      (filterLevel === "" || l.level === filterLevel),
  );

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setStatus("error");
    setTimeout(() => {
      setStatus("idle");
      setErrorMessage("");
    }, 2500);
  };

  const handleEdit = async (lessonId: number) => {
    try {
      setIsLoading(true);
      const res = await lessonService.getLessonById(lessonId);
      setCurrentLesson(res.data);
      setView("editor");
    } catch {
      console.error("Erro ao carregar lições");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentLesson({
      id: 0,
      title: "",
      book: "Gênesis",
      level: 1,
      questions: [],
    });
    setView("list");
  };

  const handleSave = async () => {
    if (!currentLesson.title?.trim())
      return triggerError("Dê um título para a lição.");
    if (currentLesson.questions?.length === 0)
      return triggerError("Adicione pelo menos uma questão.");

    for (let i = 0; i < currentLesson.questions?.length; i++) {
      const q = currentLesson.questions[i];
      if (!q.text?.trim())
        return triggerError(`Enunciado vazio na Questão ${i + 1}`);
      if (q.type === "fill_in_the_blank" && !q.text.includes("__"))
        return triggerError(`Questão ${i + 1} precisa de traços (____).`);
      if (q.type === "true_false" && !q.answer)
        return triggerError(`Questão ${i + 1} precisa de resposta correta.`);
      if (!q.explanation?.trim())
        return triggerError(`A Questão ${i + 1} precisa de explicação.`);
    }

    setIsLoading(true);
    try {
      const payload = {
        title: currentLesson.title,
        book: currentLesson.book,
        level: currentLesson.level,
        questions: currentLesson.questions,
      };
      if (currentLesson.id)
        await lessonService.updateLesson(currentLesson.id, payload);
      else await lessonService.createLesson(payload);

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        resetForm();
      }, 2000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      triggerError(axiosErr.response?.data?.detail || "Erro ao salvar lição.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!idToDelete) return;
    try {
      await lessonService.deleteLesson(idToDelete);
      void fetchLessons();
      setShowDeleteModal(false);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  };

  const addQuestion = () =>
    setCurrentLesson((prev) => ({
      ...prev,
      questions: [
        ...(prev.questions || []),
        {
          text: "",
          type: "multiple_choice",
          options: ["", "", "", ""],
          answer: "",
          explanation: "",
        },
      ],
    }));

  const removeQuestion = (idx: number) =>
    setCurrentLesson((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));

  const updateQuestion = (
    idx: number,
    field: keyof Question,
    value: unknown,
  ) => {
    setCurrentLesson((prev) => {
      const updatedQuestions = [...prev.questions];
      const question = { ...updatedQuestions[idx] } as Question;

      if (field === "type") {
        question.type = value as Question["type"];
        question.answer = question.type === "order_sequence" ? [] : "";
        question.options =
          question.type === "multiple_choice" ? ["", "", "", ""] : [];
      } else if (field === "options") {
        question.options = value as string[];
      } else if (field === "answer") {
        question.answer = value;
      } else {
        question[field] = value as string;
      }

      updatedQuestions[idx] = question;
      return { ...prev, questions: updatedQuestions };
    });
  };

  return (
    <div className="space-y-6">
      <StatusModal status={status} message={errorMessage} />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onConfirm={executeDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <div className="flex items-center justify-between gap-2 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Lições</h2>
        {view === "list" && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setView("editor");
            }}
            className="px-4 py-2 rounded-xl font-bold text-sm bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8] hover:bg-biblo-blue/90 transition-all"
          >
            + Nova Lição
          </button>
        )}
      </div>

      {view === "list" ? (
        <LessonList
          lessons={filteredLessons || []}
          filters={{ filterTitle, filterBook, filterLevel }}
          setFilters={{
            setFilterTitle,
            setFilterBook,
            setFilterLevel,
          }}
          onEdit={handleEdit}
          onDelete={(id) => {
            setIdToDelete(id);
            setShowDeleteModal(true);
          }}
        />
      ) : (
        <LessonEditor
          lesson={currentLesson}
          setLesson={setCurrentLesson}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
          onSave={handleSave}
          onCancel={resetForm}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
