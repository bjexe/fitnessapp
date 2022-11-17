import React from 'react'
import Workout from './Workout'
import workoutSummaryData from '../workoutSummaryData'
import workoutData from '../exampleWorkoutData'
import Modal from 'react-modal'
import comms from '../services/comms'
import './Home.css'
import login from '../services/login'
import {AuthContext, AuthProvider, useAuth, AuthStatus, RequireAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'

Modal.setAppElement('#root')

const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      overflowy: 'scroll',
      maxHeight: '80%'
    },
}

const buttonStyle = {
    height: '100px'
}

export default function Home() {

    let auth = useAuth()
    let navigate = useNavigate()

    // states
    const [showModal, setShowModal] = React.useState(false)
    const [showWorkoutModal, setShowWorkoutModal] = React.useState(false)
    const [showTemplatesModal, setShowTemplatesModal] = React.useState(false)
    const [templateFormData, setTemplateFormData] = React.useState({
        name: "",
        exercises: [{
            name: "",
            sets: [{
                weight: 0,
                reps: 0
            }],
        }]
    })

    const [templates, setTemplates] = React.useState([])

    React.useEffect(() => {
        getTemplates()
    }, [])

    // functions for creating a workout template
    function openTemplateModal() {
        setShowModal(true)
    }

    function closeModal() {
        setTemplateFormData({
            name: "",
            exercises: [{
                name: "",
                sets: [{
                    weight: 0,
                    reps: 0
                }],
            }]
        })
        setShowModal(false)
    }

    function handleFormChange(event, index, setIndex = 0){
        const regex = /^[0-9\b]+$/ // to allow only numbers in inputs for reps and weight
        const {name, value} = event.target

        setTemplateFormData(oldForm => {
            let newForm = {...oldForm}
            if (name === "templateName"){
                newForm.name = value
            } else if (name === "exerciseName") {
                newForm.exercises[index].name = value
            } else if (name === "weight") {
                if (value === '' || regex.test(value)){
                    newForm.exercises[index].sets[setIndex].weight = value
                }
            } else if (name === "reps") {
                if (value === '' || regex.test(value)){
                    newForm.exercises[index].sets[setIndex].reps = value
                }
            }
            return newForm
        })
    }

    function addExercise() {
        setTemplateFormData(oldForm => {
            let newForm = {...oldForm}
            newForm.exercises.push({
                name: "",
                sets: [{
                    weight: 0,
                    reps: 0
                }]
            })
            return newForm
        })
    }

    function addSet(event, index) {
        event.preventDefault()
        setTemplateFormData(oldForm => {
            let newForm = {...oldForm}
            newForm.exercises[index].sets.push({
                weight: 0,
                reps: 0
            })
            return newForm
        })
    }

    // functions for viewing 'recent workouts', will be implemented when database is up and this app has access to it through an API
    function openWorkoutModal() {
        setShowWorkoutModal(true)
    }

    function closeWorkoutModal () {
        setShowWorkoutModal(false)
    }

    //functions for starting workouts
    function openWorkoutTemplateModal() {
        setShowTemplatesModal(true)
    }

    function closeWorkoutTemplateModal() {
        setShowTemplatesModal(false)
    }

    async function handleTemplateSubmit(event) {
        event.preventDefault()
        try{
            const res = await comms.createTemplate(templateFormData)
            getTemplates()
        } catch (exception) {
            console.log(`failed to submit template`)
        }
    }

    async function getTemplates(event) {
        event.preventDefault()
        try {
            const templatesArray = await comms.getAllUserTemplates()
            setTemplates(templatesArray)
        } catch (exception) {
            console.log(JSON.stringify(exception, null, 2))
        }
    }

    const formInputs = templateFormData.exercises.map((exercise, index) => {

        const sets = exercise.sets.map((set, setIndex) => {
            return (
                <div>
                    <p>Set {setIndex + 1}:</p>
                    <input name="weight" value = {set.weight} onChange={e => handleFormChange(e, index, setIndex)} placeholder="Weight"/>
                    <input name="reps" value = {set.reps} onChange = {e => handleFormChange(e, index, setIndex)} placeholder="Reps"/>
                </div>
            )
        })

        return(
            <div key={index}>
                {exercise.name ? <h1>{exercise.name}</h1> : <h1>Unnamed Exercise</h1>}
                <span>
                    <p>Name: </p>
                    <input name="exerciseName" value={exercise.name} onChange={e => handleFormChange(e, index)}/>
                </span>
                <button onClick={(e) => addSet(e, index)}>Add a set</button>
                {sets}
                <hr/>
            </div>
        )
    })

    const recentWorkouts = workoutSummaryData.map((workout) => {
        return (
            <>
                <hr />

                <div onClick={openWorkoutModal}>
                    <p style={{fontsize: "100px"}}>{workout.title}</p>
                    <p>{workout.exercises} Exercises</p>
                </div>

                <Modal
                    isOpen={showWorkoutModal}
                    onRequestClose={closeWorkoutModal}
                    style={modalStyles}
                    contentLabel = "show recent workouts"
                >
                    <Workout workoutData={workoutData} active={false}/>
                </Modal>
            </>
        )
    })

    const templateSelections = templates.map((template, index) => {
        /*onClick={beginWorkout(template)}*/ //to be implemented when react router is learned
        return (
            <button onClick={e => e.preventDefault()}>{template.name}</button> 
        )
    })

    return (
        <div className='home'>

            <nav className='home-nav'>
                yacked
            </nav>

            <div className='content'>
                <div className='menu'>
                    <button onClick={openTemplateModal} name="create-template" style={buttonStyle}>
                        Create a workout template
                    </button>
                    <button onClick={() => comms.printToken()}>Print token from comms</button>
                    <Modal
                        isOpen={showModal}
                        onRequestClose={closeModal}
                        style={modalStyles}
                        contentLabel = "create a new workout template"
                    >
                        <form onSubmit={handleTemplateSubmit}>
                            {templateFormData.name ? <h1>{templateFormData.name}</h1> : <h1>Unnamed Template</h1>}
                            <input name="templateName" placeholder="Name of template" value = {templateFormData.name} onChange={handleFormChange}/>
                            <button type="button" onClick={addExercise}>Add an exercise</button>
                            {formInputs}
                            <button>Submit template</button>
                        </form>
                    </Modal>

                    <button onClick={openWorkoutTemplateModal} name="startTemplate" style={buttonStyle}>
                        Start workout from template
                    </button>

                    <Modal
                        isOpen={showTemplatesModal}
                        onRequestClose={closeWorkoutTemplateModal}
                        // onAfterOpen={getTemplates}
                        style={modalStyles}
                        contentLabel = "create a new template"
                    >
                        <h2>Select a template to begin</h2>
                        {templateSelections}
                    </Modal>

                    <button style = {buttonStyle} onClick={openWorkoutModal} name="startEmpty">
                        Start empty workout
                    </button>

                </div>

                <div className='recent-workouts'>
                    <h1>Recent Workouts</h1>
                    {recentWorkouts}
                </div>

            </div>
        </div>
    )
}