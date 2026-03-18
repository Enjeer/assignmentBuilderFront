import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { apiClient } from "@/services/apiClient"
import { Project } from "@/shared/types/common"
import editIcon from "@/assets/images/edit-icon.svg"
import openIcon from "@/assets/images/open-icon.svg"
import deleteIcon from "@/assets/images/delete-icon.svg"
import gotoIcon from "@/assets/images/goto.svg"

type FilterName = "type" | "sort" | "status"

export default function ProjectsPage() {

    const [projects, setProjects] = useState<Project[]>([])

    const [filters, setFilters] = useState({
        type: "Все",
        sort: "По дате",
        status: "Все",
    })

    const [isOpen, setIsOpen] = useState({
        type: false,
        sort: false,
        status: false,
    })

    const filterOptions = {
        type: {
            "Все": "all",
            "Курсовая": "course",
            "Лабораторная": "lab",
            "Эссе": "essay",
            "Диплом": "diplom",
            "Реферат": "ref",
        },
        sort: {
            "По дате": "date",
            "По названию": "name",
            "По типу": "type",
            "По статусу": "status",
        },
        status: {
            "Активные": "active",
            "В процессе": "inProgress",
            "Завершенные": "done",
            "Все": "all",
        }
    }

    const toggleDropdown = (filterName: FilterName) => {
        setIsOpen(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }))
    }

    const selectOption = (filterName: FilterName, option: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: option
        }))

        setIsOpen(prev => ({
            ...prev,
            [filterName]: false
        }))
    }

    useEffect(() => {
        apiClient.getProjects().then(projects => setProjects(projects))
    }, [])

    const handleOpen = (projectId: string) => {
        console.log("Open project:", projectId)
    }

    const handleEdit = (projectId: string) => {
        console.log("Edit project:", projectId)
    }

    const handleDelete = (projectId: string) => {
        if (window.confirm("Вы уверены, что хотите удалить проект?")) {
            console.log("Delete project:", projectId)
        }
    }

    const filteredProjects = projects
        .filter(project => {

            const selectedType = filterOptions.type[filters.type]
            const selectedStatus = filterOptions.status[filters.status]

            if (selectedType !== "all" && project.type !== selectedType) {
                return false
            }

            if (selectedStatus !== "all" && project.status !== selectedStatus) {
                return false
            }

            return true
        })
        .sort((a, b) => {

            const sortType = filterOptions.sort[filters.sort]

            if (sortType === "date") {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            }

            if (sortType === "name") {
                return a.name.localeCompare(b.name)
            }

            if (sortType === "type") {
                return a.type.localeCompare(b.type)
            }

            if (sortType === "status") {
                return a.status.localeCompare(b.status)
            }

            return 0
        })

    return (
        <section className="projects-page__container">

            {/* Фильтры */}
            <section className="projects__meta-container">
                <section className="projects__controls">

                    <ul className="filters__list">

                        {/* TYPE */}
                        <li className="filters__element">

                            <span>Тип работы:</span>

                            <button
                                className={`filter-btn dropdown-trigger ${isOpen.type ? "active" : ""}`}
                                onClick={() => toggleDropdown("type")}
                            >
                                {filters.type}
                            </button>

                            {isOpen.type && (

                                <ul className="dropdown__menu">

                                    {Object.keys(filterOptions.type).map(option => (

                                        <li key={option}>

                                            <button
                                                className={`dropdown__item ${filters.type === option ? "selected" : ""}`}
                                                onClick={() => selectOption("type", option)}
                                            >
                                                {option}
                                            </button>

                                        </li>

                                    ))}

                                </ul>

                            )}

                        </li>

                        {/* SORT */}
                        <li className="filters__element">

                            <span>Сортировка:</span>

                            <button
                                className={`filter-btn dropdown-trigger ${isOpen.sort ? "active" : ""}`}
                                onClick={() => toggleDropdown("sort")}
                            >
                                {filters.sort}
                            </button>

                            {isOpen.sort && (

                                <ul className="dropdown__menu">

                                    {Object.keys(filterOptions.sort).map(option => (

                                        <li key={option}>

                                            <button
                                                className={`dropdown__item ${filters.sort === option ? "selected" : ""}`}
                                                onClick={() => selectOption("sort", option)}
                                            >
                                                {option}
                                            </button>

                                        </li>

                                    ))}

                                </ul>

                            )}

                        </li>

                        {/* STATUS */}
                        <li className="filters__element">

                            <span>Статус:</span>

                            <button
                                className={`filter-btn dropdown-trigger ${isOpen.status ? "active" : ""}`}
                                onClick={() => toggleDropdown("status")}
                            >
                                {filters.status}
                            </button>

                            {isOpen.status && (

                                <ul className="dropdown__menu">

                                    {Object.keys(filterOptions.status).map(option => (

                                        <li key={option}>

                                            <button
                                                className={`dropdown__item ${filters.status === option ? "selected" : ""}`}
                                                onClick={() => selectOption("status", option)}
                                            >
                                                {option}
                                            </button>

                                        </li>

                                    ))}

                                </ul>

                            )}

                        </li>

                    </ul>

                    {/* Последние проекты */}
                    {projects.length > 0 && (

                        <ul className="recents__list">

                            <span className="recents__title">Последние:</span>

                            {projects.slice(0, 3).map(project => (

                                <li key={project.id} className="recent__element">

                                    <button className="recent__btn">

                                        <span className="recent__name">
                                            {project.name}
                                        </span>

                                        <div className="recent__info">

                                            <span className={`recent__type recent__type--${project.type}`}>
                                                {project.type}
                                            </span>

                                            <span className="recent__action">
                                                <img src={gotoIcon} alt="" />
                                            </span>

                                        </div>

                                    </button>

                                </li>

                            ))}

                        </ul>

                    )}

                </section>
            </section>

            {/* Проекты */}
            <section className="projects-container">

                {filteredProjects.length > 0 ? (

                    <ul className="projects__list">

                        {filteredProjects.map(project => (

                            <li key={project.id} className="project__element">

                                <article className="project__info">

                                    <h2 className="project__project-name">
                                        {project.name}                                        
                                        <span className="project__status"> 
                                            {project.status} 
                                        </span>
                                    </h2>

                                    <p className="project__description">
                                        {project.description}
                                    </p>

                                    <div className="project__meta">

                                        <span className={`project__type project__type--${project.type}`}>
                                            {project.type}
                                        </span>

                                        <span className="project__date">
                                            {project.date}
                                        </span>

                                    </div>

                                </article>

                                <section className="project__interaction">

                                    <button
                                        className="btn interaction__button-open"
                                        onClick={() => handleOpen(project.id)}
                                    >
                                        <img src={openIcon} alt="" />
                                        Просмотреть
                                    </button>

                                    <button
                                        className="btn interaction__button-edit"
                                        onClick={() => handleEdit(project.id)}
                                    >
                                        <img src={editIcon} alt="" />
                                        Редактировать
                                    </button>

                                    <button
                                        className="btn interaction__button-delete"
                                        onClick={() => handleDelete(project.id)}
                                    >
                                        <img src={deleteIcon} alt="" />
                                        Удалить
                                    </button>

                                </section>

                            </li>

                        ))}

                    </ul>

                ) : (

                    <div className="projects__empty">

                        <p>У вас пока нет проектов</p>

                        <Link to="/editor/new" className="btn btn-primary">
                            Создать первый проект
                        </Link>

                    </div>

                )}

            </section>

        </section>
    )
}