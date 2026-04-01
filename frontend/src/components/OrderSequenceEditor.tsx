import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import type { QuestionForm } from "../views/Admin";


export const OrderSequenceEditor = ({
    question,
    index,
    updateQuestion
}: {
    question: QuestionForm,
    index: number,
    updateQuestion: any
}) => {
    const [newItem, setNewItem] = useState('');

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(question.options);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Na ordenação, a 'answer' é o array na ordem correta
        updateQuestion(index, 'options', items);
        updateQuestion(index, 'answer', items);
    };

    const addItem = () => {
        const trimmedItem = newItem.trim();
        if (!trimmedItem) return;

        // Criamos a nova lista baseada na atual
        const updatedOptions = [...question.options, trimmedItem];

        // Atualizamos o pai. 
        updateQuestion(index, 'options', updatedOptions);
        updateQuestion(index, 'answer', updatedOptions);

        setNewItem(''); // Limpa o campo
    };

    const removeItem = (optIdx: number) => {
        const updatedOptions = question.options.filter((_, i) => i !== optIdx);
        updateQuestion(index, 'options', updatedOptions);
        updateQuestion(index, 'answer', updatedOptions);
    };

    return (
        <div className="space-y-4 bg-blue-50/50 p-4 rounded-2xl border-2 border-dashed border-blue-100">
            <div className="flex gap-2">
                <input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Adicionar item à sequência..."
                    className="flex-1 p-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-biblo-blue"
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <button
                    onClick={addItem}
                    className="p-3 bg-biblo-blue text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`droppable-${index}`}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {question.options.map((opt, oIdx) => (
                                <Draggable key={`${index}-${oIdx}-${opt}`} draggableId={`${index}-${oIdx}`} index={oIdx}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`flex items-center gap-3 p-3 bg-white border-2 rounded-xl transition-all ${snapshot.isDragging ? 'border-biblo-blue shadow-lg z-50' : 'border-gray-100'
                                                }`}
                                        >
                                            <div {...provided.dragHandleProps} className="text-gray-400">
                                                <GripVertical size={18} />
                                            </div>
                                            <span className="flex-1 text-sm font-bold text-gray-700">
                                                <span className="text-biblo-blue mr-2">{oIdx + 1}.</span>
                                                {opt}
                                            </span>
                                            <button onClick={() => removeItem(oIdx)} className="text-gray-300 hover:text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                💡 Arraste para definir a ordem correta
            </p>
        </div>
    );
};