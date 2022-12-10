import React from 'react'
import WorkoutSummary from './WorkoutSummary'
import Modal from 'react-modal'
import comms from '../services/comms'
import './Home.css'
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {useWorkout} from '../context/WorkoutContext'
import {Link} from 'react-router-dom'

Modal.setAppElement('#root')

const modalStyles = {
    content: {
      backgroundColor: '#91C6E3',
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

export default function Home() {

    let auth = useAuth()
    let workout = useWorkout()
    let navigate = useNavigate()

    // states
    const [showModal, setShowModal] = React.useState(false)
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
    const [pastWorkouts, setPastWorkouts] = React.useState([])

    const [templates, setTemplates] = React.useState([])

    const [bodyWeight, setBodyWeight] = React.useState(0)
    const [showUpdateBodyWeight, setShowUpdateBodyWeight] = React.useState(false)

    React.useEffect(() => {
        getTemplates()
        getPastWorkouts()
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
        // event.preventDefault()
        try {
            const templatesArray = await comms.getAllUserTemplates()
            setTemplates(templatesArray)
        } catch (exception) {
            console.log(JSON.stringify(exception, null, 2))
        }
    }

    async function getPastWorkouts() {
        try {
            const workoutsArray = await comms.getAllUserWorkouts()
            setPastWorkouts([...workoutsArray])
        } catch (exception) {
            console.log(JSON.stringify(exception, null, 2))
        }
    }

    function startWorkoutFromTemplate(event) {
        const {name} = event.target
        const template = templates.find(template => {
            return template.id === name
        })
        workout.update(template)
        navigate('/workout')
    }

    function startEmptyWorkout(event){ 
        workout.update({
            name: "",
            exercises: []
        })
        navigate('/workout')
    }

    function handleBodyWeightChange(event) {
        const {value} = event.target
        setBodyWeight(value)
    }

    async function handleBodyWeightSubmit() {
        setShowUpdateBodyWeight(false)
        const updatedWeight = await comms.updateWeight(bodyWeight)
        auth.updateWeight(updatedWeight)
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
                <button className="btn" onClick={(e) => addSet(e, index)}>Add a set</button>
                {sets}
            </div>
        )
    })

    const recentWorkouts = pastWorkouts.map((workout) => {
        return (
            <WorkoutSummary data={workout} setPastWorkouts={setPastWorkouts}/>
        )
    })

    const templateSelections = templates.map((template, index) => {
        return (
            <button name={template.id} onClick={e => startWorkoutFromTemplate(e)} className="btn">{template.name ? template.name : "Unnamed Template"}</button> 
        )
    })

    return (
        <div className='home'>

            <nav className='home-nav'>
                <div className='logo'>
                    <h1>yacked</h1>
                </div>
                <div className='user-info'>
                    <p>Logged in as {auth.user.username}</p>
                    <Link to='/settings'>Settings</Link>
                </div>
            </nav>

            <div className='content'>
                <div className='stats'>
                    <p> Current weight: { auth.user.weight.length <= 0 ? 'No weight tracked' : auth.user.weight[auth.user.weight.length - 1].value } lbs</p>
                </div>
                <div className='menu'>

                    {!showUpdateBodyWeight && <button onClick={e => setShowUpdateBodyWeight(true)} className='btn'>Update body weight</button>}
                    {showUpdateBodyWeight && <input value={bodyWeight} onChange={e => handleBodyWeightChange(e)} name="bodyWeight" placeholder="Enter new bodyweight"/>}
                    {showUpdateBodyWeight && <button onClick={e => handleBodyWeightSubmit(e)}>Submit</button>}

                    <button onClick={openTemplateModal} name="create-template" className="btn">
                        Create a workout template
                    </button>
                    <Modal
                        isOpen={showModal}
                        onRequestClose={closeModal}
                        style={modalStyles}
                        contentLabel = "create a new workout template"
                    >
                        <div className='template-modal'>
                            <form onSubmit={handleTemplateSubmit}>
                                {templateFormData.name ? <h1>{templateFormData.name}</h1> : <h1>Unnamed Template</h1>}
                                <input name="templateName" placeholder="Name of template" value = {templateFormData.name} onChange={handleFormChange}/>
                                <button type="button" onClick={addExercise} className="btn">Add an exercise</button>
                                {formInputs}
                                <button className="btn">Submit template</button>
                            </form>
                        </div>   
                    </Modal>

                    <button onClick={openWorkoutTemplateModal} name="startTemplate" className="btn">
                        Start workout from template
                    </button>

                    <button onClick={startEmptyWorkout} name="newWorkout" className="btn">Start workout from scratch</button>

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

                </div>

                <h1 className='recent-workouts-header'>Recent Workouts</h1>
                
                <div className='recent-workouts'>
                    {recentWorkouts.length ? recentWorkouts : <h2>No workouts yet</h2>}
                </div>

            </div>
        </div>
    )
}