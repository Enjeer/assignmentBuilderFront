import React, { useState, useEffect, useRef } from "react";
import { mockProject } from "@/shared/mockProject";
import { Project, Block } from "@/shared/types/common";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import editIcon from "@/assets/images/edit-icon.svg"
import openIcon from "@/assets/images/open-icon.svg" 
import deleteIcon from "@/assets/images/delete-icon.svg" 
import gotoIcon from "@/assets/images/goto.svg" 
import saveIcon from "@/assets/images/save-icon.svg"

export default function EditorPage() {
    const [project, setProject] = useState<Project | null>(null);
    const [isNameEditing, setIsNameEditing] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setProject(mockProject);
    }, []);

    const toggleNameEdit = () => {
        setIsNameEditing(prev => !prev);
        setTimeout(() => {
        if (!isNameEditing && nameInputRef.current) nameInputRef.current.focus();
        }, 0);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!project) return;
        setProject({ ...project, name: e.target.value });
    };

    const handlekeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") toggleNameEdit();
    };

    const onDragEnd = (result: any) => {
        if (!result.destination || !project) return;

        const newBlocks = Array.from(project.data.blocks);
        const draggedBlock = newBlocks[result.source.index];

        if (["titlePage", "toc", "sources"].includes(draggedBlock.type)) return;

        newBlocks.splice(result.source.index, 1);
        newBlocks.splice(result.destination.index, 0, draggedBlock);

        const updated = newBlocks.map((b, idx) => ({ ...b, order: idx }));
        setProject({ ...project, data: { ...project.data, blocks: updated } });
    };

    const handleBlockContentChange = (blockId: string, field: string, value: string) => {
        if (!project) return;
        const newBlocks = project.data.blocks.map(b => {
        if (b.id === blockId) {
            return { ...b, content: { ...b.content, [field]: value } };
        }
        return b;
        });
        setProject({ ...project, data: { ...project.data, blocks: newBlocks } });
    };

    const renderBlock = (block: Block) => {
        switch (block.type) {
        case "titlePage":
            return (
            <div key={block.id} className="block block-titlePage">
                <input
                type="text"
                value={block.content.title}
                onChange={(e) => handleBlockContentChange(block.id, "title", e.target.value)}
                className="block-input title-input"
                />
                <input
                type="text"
                value={block.content.university}
                onChange={(e) => handleBlockContentChange(block.id, "university", e.target.value)}
                className="block-input"
                />
                {block.content.faculty && (
                <input
                    type="text"
                    value={block.content.faculty}
                    onChange={(e) => handleBlockContentChange(block.id, "faculty", e.target.value)}
                    className="block-input"
                />
                )}
                {block.content.department && (
                <input
                    type="text"
                    value={block.content.department}
                    onChange={(e) => handleBlockContentChange(block.id, "department", e.target.value)}
                    className="block-input"
                />
                )}
                <input
                type="text"
                value={`${block.content.studentName} ${block.content.group}`}
                onChange={(e) => handleBlockContentChange(block.id, "studentName", e.target.value)}
                className="block-input"
                />
                {block.content.teacherName && (
                <input
                    type="text"
                    value={block.content.teacherName}
                    onChange={(e) => handleBlockContentChange(block.id, "teacherName", e.target.value)}
                    className="block-input"
                />
                )}
                <input
                type="text"
                value={`${block.content.city}, ${block.content.year}`}
                onChange={(e) => handleBlockContentChange(block.id, "city", e.target.value)}
                className="block-input"
                />
            </div>
            );

        case "text":
            return (
            <textarea
                key={block.id}
                value={block.content.text}
                onChange={(e) => handleBlockContentChange(block.id, "text", e.target.value)}
                className="block-textarea"
            />
            );

        case "image":
            return (
            <div key={block.id} className="block block-image">
                <input
                type="text"
                value={block.content.imageUrl}
                onChange={(e) => handleBlockContentChange(block.id, "imageUrl", e.target.value)}
                className="block-input"
                />
                <input
                type="text"
                value={block.content.caption || ""}
                onChange={(e) => handleBlockContentChange(block.id, "caption", e.target.value)}
                className="block-input"
                />
                {block.content.imageUrl && <img src={block.content.imageUrl} alt={block.content.caption || ""} />}
            </div>
            );

        case "chapter":
        case "subChapter":
            return (
            <div key={block.id} className={`block block-${block.type}`}>
                <input
                type="text"
                value={block.name}
                onChange={(e) => handleBlockContentChange(block.id, "name", e.target.value)}
                className="block-input chapter-input"
                />
                <div className="block-children">
                {block.children.map((child) => renderBlock(child))}
                </div>
            </div>
            );

        default:
            return null;
        }
    };

    if (!project) return <div>Loading...</div>;

    return (
        <section className="editor-page__container">
            <section className="editor__credentials">
                <div className="document__name-container">
                    <button className="name__edit" onClick={toggleNameEdit}>
                        <img src={isNameEditing ? gotoIcon : editIcon} alt="Edit document name" />
                    </button>
                    <span
                    className={`document__name ${isNameEditing ? 'hidden' : ''}`}
                    id="nameHolder"
                    >
                    {project?.name}
                    </span>
                    <input
                    type="text"
                    id="nameField"
                    ref={nameInputRef}
                    value={project?.name}
                    onChange={handleNameChange}
                    onKeyDown={handlekeyDown}
                    className={`change-input ${isNameEditing ? '' : 'hidden'}`}
                    maxLength={45}
                    />
                </div>
                <div className="document__interaction">
                    <button className="btn interaction__button-save">
                        <img src={saveIcon} alt="Save" />
                    </button>
                    <button className="btn interaction__button-delete">
                        <img src={deleteIcon} alt="Delete" />
                    </button>
                </div>
            </section>

        <section className="editor__container">
            <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
                {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="editor__builder">
                    {project.data.blocks.map((block, index) => (
                    <Draggable
                        key={block.id}
                        draggableId={block.id}
                        index={index}
                        isDragDisabled={["titlePage", "toc", "sources"].includes(block.type)}
                    >
                        {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            {renderBlock(block)}
                        </div>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
            </DragDropContext>
            <section className="editor__viewport">Preview</section>
        </section>
        </section>
    );
}