import type { Question } from "@/types";
import { OrderSequenceEditor } from "./OrderSequenceEditor";

interface Props {
  q: Question;
  index: number;
  updateQuestion: (idx: number, field: keyof Question, val: unknown) => void;
  removeQuestion: (idx: number) => void;
}

export function QuestionEditorItem({
  q,
  index,
  updateQuestion,
  removeQuestion,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-b-4 border-gray-200 space-y-4 relative animate-fadeIn">
      <div className="flex justify-between items-center">
        <span className="bg-biblo-blue text-white px-3 py-1 rounded-full font-black text-[12px]">
          QUESTÃO {index + 1}
        </span>
        <button
          type="button"
          onClick={() => removeQuestion(index)}
          className="text-red-500 cursor-pointer font-bold text-xs uppercase hover:text-red-700"
        >
          Remover
        </button>
      </div>

      <select
        className="w-full p-3 bg-gray-50 cursor-pointer border-2 border-gray-100 rounded-xl font-bold text-gray-600"
        value={q.type}
        onChange={(e) => updateQuestion(index, "type", e.target.value)}
      >
        <option value="multiple_choice">Múltipla Escolha</option>
        <option value="true_false">Verdadeiro ou Falso</option>
        <option value="order_sequence">Ordenação</option>
        <option value="fill_in_the_blank">Preencha a Lacuna</option>
      </select>

      <textarea
        placeholder="Enunciado..."
        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold outline-none focus:border-biblo-blue resize-none"
        value={q.text}
        onChange={(e) => updateQuestion(index, "text", e.target.value)}
      />

      {q.type === "true_false" && (
        <div className="flex gap-4">
          {["Verdadeiro", "Falso"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={q.answer === opt}
                className="form-radio text-biblo-blue"
                onChange={() => updateQuestion(index, "answer", opt)}
              />
              <span className="font-bold">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {q.type === "multiple_choice" && (
        <div className="grid gap-2">
          {q.options.map((opt, oIdx) => (
            <div key={oIdx} className="flex gap-2">
              <input
                type="radio"
                checked={q.answer === opt && opt !== ""}
                className="form-radio text-biblo-blue"
                onChange={() => updateQuestion(index, "answer", opt)}
              />
              <input
                placeholder={`Opção ${oIdx + 1}`}
                className="flex-1 p-2 border-2 border-gray-200 rounded-xl text-sm font-bold"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...q.options];
                  newOpts[oIdx] = e.target.value;
                  updateQuestion(index, "options", newOpts);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {q.type === "order_sequence" && (
        <OrderSequenceEditor
          question={q}
          index={index}
          updateQuestion={updateQuestion}
        />
      )}

      {q.type === "fill_in_the_blank" && (
        <div className="space-y-4">
          <input
            placeholder="Resposta correta (Ex: descansou)"
            className="w-full bg-white border-2 border-gray-200 uppercase placeholder:normal-case rounded-2xl font-bold text-biblo-blue p-3 outline-none focus:border-biblo-blue"
            value={typeof q.answer === "string" ? q.answer : ""}
            onChange={(e) => updateQuestion(index, "answer", e.target.value)}
          />
        </div>
      )}

      <input
        placeholder="Explicação da resposta..."
        className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm"
        value={q.explanation}
        onChange={(e) => updateQuestion(index, "explanation", e.target.value)}
      />
    </div>
  );
}
