import React from 'react'
import WorkoutSummary from './WorkoutSummary'
import Modal from 'react-modal'
import comms from '../services/comms'
import './Home.css'
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {useWorkout} from '../context/WorkoutContext'
import {Link} from 'react-router-dom'
import CsvDownloadButton from 'react-json-to-csv'

Modal.setAppElement('#root')

const modalStyles = {
    content: {
      backgroundColor: '#272635',
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
    const [showTemplateManagementModal, setShowTemplateManagementModal] = React.useState(false)
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
    const [templateManagementBody, setTemplateManagementBody] = React.useState({active: false, op: ""})
    const [templateManagementSelections, setTemplateManagementSelections] = React.useState([])
    const [templateEditActive, setTemplateEditActive] = React.useState(false)

    React.useEffect(() => {
        getTemplates()
        getPastWorkouts()
    }, [])

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

    function deleteSet(event, index) {
        event.preventDefault()
        setTemplateFormData(oldForm => {
            let newForm = {...oldForm}
            newForm.exercises[index].sets.pop()
            return newForm
        })
    }

    function openWorkoutTemplateModal() {
        setShowTemplatesModal(true)
    }

    function closeWorkoutTemplateModal() {
        setShowTemplatesModal(false)
    }

    async function handleTemplateSubmit(event) {
        event.preventDefault()
        try{
            await comms.createTemplate(templateFormData)
            getTemplates()
            closeModal()
        } catch (exception) {
            console.log(`failed to submit template`)
        }
    }

    async function handleTemplateUpdate(event){
        event.preventDefault()
        try{
            await comms.updateTemplate(templateFormData.id, templateFormData)
            getTemplates()
            setShowTemplateManagementModal(false)
            setTemplateManagementBody({active: false, op: ''})
            setTemplateEditActive(false)
        } catch(exception){
            console.log('failed to update template')
            console.log(JSON.stringify(exception, null, 2))
            getTemplates()
            setShowTemplateManagementModal(false)
            setTemplateManagementBody({active: false, op: ''})
            setTemplateEditActive(false)
        }
    }

    async function getTemplates(event) {
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

    function openTemplateManagementModal(){ 
        setShowTemplateManagementModal(true)
    }

    async function closeTemplateManagementModal() {
        setShowTemplateManagementModal(false)
        setTemplateManagementBody({active: false, op:''})
        setTemplateEditActive(false)
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
    }

    async function handleTemplateManagementSubmit() {
        if(templateManagementBody.op === 'del') {
            let templatesDeleted = 0
            templateManagementSelections.forEach(async (template) => {
                await comms.deleteTemplate(template.id)
                templatesDeleted++
                if(templatesDeleted === templateManagementSelections.length) { // could be better done with promises
                    await getTemplates()
                }
            })
        } else if(templateManagementBody.op === 'edit') {
            templateManagementSelections.forEach(async (template) => {
                comms.updateTemplate(template.id, templateFormData)
            })
        } else {
            console.log('no op detected')
        }

        setTemplateManagementBody({active: false, op: ""})
        closeTemplateManagementModal()
    }

    function handleTemplateManagementClick(event){
        const {name} = event.target
        if(templateManagementBody.op === 'del') {
            if(templateManagementSelections.filter(template => template.id === name).length > 0) {
                setTemplateManagementSelections(old => {
                    const ret = old.filter(template => template.id !== name)
                    return ret
                })
            } else {
                setTemplateManagementSelections((old) => {
                    const ret = [...old]
                    ret.push(templates.find(template => template.id === name))
                    return ret
                })
            }
        } else {
            setTemplateFormData(templates.find(template => template.id === name))
            setTemplateEditActive(true)
        }
    }

    function deleteWeightHistory() {
        comms.deleteWeightHistory()
        auth.updateWeight([])
    }

    const purgedWeight = auth.user.weight.length > 1 ? auth.user.weight.map(entry => {
        delete entry._id
        return entry
    }) : []

    const formInputs = templateFormData.exercises.map((exercise, index) => {

        const sets = exercise.sets.map((set, setIndex) => {
            return (
                <div>
                    <p style={{"color": "#e8e9f3"}}>Set {setIndex + 1}:</p>
                    <span className="workout-values">
                        <input name="weight" value = {set.weight} onChange={e => handleFormChange(e, index, setIndex)} placeholder="Weight"/>
                        <p style={{"color": "#e8e9f3"}}>lbs</p>
                    </span>
                    <span className="workout-values">
                        <input name="reps" value = {set.reps} onChange = {e => handleFormChange(e, index, setIndex)} placeholder="Reps"/>
                        <p style={{"color": "#e8e9f3"}}> reps</p>
                    </span>
                </div>
            )
        })

        return(
            <div key={index}>
                <hr style={{"color": "#e8e9f3", "width": "auto", "backgroundColor": "#e8e9f3"}}/>
                <span style={{"display":"flex", "justifyContent": "center"}}>
                    <h1 style={{"color": "#e8e9f3"}}>Exercise #{index + 1}: {exercise.name ? exercise.name : "Unnamed Exercise"}</h1>
                </span>
                <span>
                    <p style={{"color": "#e8e9f3"}}>Name: </p>
                    <input name="exerciseName" value={exercise.name} onChange={e => handleFormChange(e, index)}/>
                </span>
                <span style={{"display":"flex", "gap": "32px", "justifyContent": "center"}}>
                    <button className="btn" onClick={(e) => addSet(e, index)}>Add set</button>
                    <button className='btn' onClick={e => deleteSet(e, index)}>Delete last set</button>
                </span>
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

    const templateManagementSelectionsButtons = templates.map((template, index) => {
        let isSelected = false
        if(templateManagementSelections.filter(selection => template.id === selection.id).length > 0) {
            isSelected = true
        }
        return (
            <button name={template.id} onClick={e => (handleTemplateManagementClick(e))} className={isSelected ? 'btn-green' : 'btn'}>{template.name ? template.name : "Unnamed Template"}</button>
        )
    })

    return (
        <div className='home'>

            <nav className='home-nav'>
                <div className='home-nav-content'>
                    <div className='logo'>
                        <h1 style={{"color": "#e8e9f3", "fontSize": "50px", "margin-left": "50px"}}>yacked</h1>
                    </div>
                    <div className='user-info'>
                        <p style={{"color": "#e8e9f3", "fontSize": "30px"}}>Logged in as {auth.user.username}</p>
                        <Link to='/settings' style={{"fontSize" : "30px", "marginRight": "50px"}}>Settings</Link>
                    </div>
                </div>
            </nav>

            <div className='content'>
                <div className='stats'>
                    <p style={{"color": "#e8e9f3", "fontSize": "32px", "margin": "0"}}> Current weight: { auth.user.weight.length < 1 ? 'No weight tracked' : auth.user.weight[auth.user.weight.length - 1].value } lbs</p>
                    {auth.user.weight.length > 1 && <CsvDownloadButton data={purgedWeight} filename="weight_history.csv" className='btn'>Export weight history (csv)</CsvDownloadButton>}
                    <button onClick={deleteWeightHistory} className='btn'>Delete weight history</button>
                </div>
                <div className='menu'>

                    {!showUpdateBodyWeight && <button onClick={e => setShowUpdateBodyWeight(true)} className='btn'>Update body weight</button>}
                    {showUpdateBodyWeight && <input value={bodyWeight} onChange={e => handleBodyWeightChange(e)} name="bodyWeight" placeholder="Enter new bodyweight"/>}
                    <div style={{"display":"flex", "justifyContent": "center", "gap": "32px"}}>
                        {showUpdateBodyWeight && <button className='btn-purple' onClick={e => handleBodyWeightSubmit(e)}>Submit</button>}
                        {showUpdateBodyWeight && <button className='btn-purple' onClick={e => setShowUpdateBodyWeight(false)}>Cancel</button>}
                    </div>

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
                                {templateFormData.name ? <h1 style={{"color": "#e8e9f3"}}>{templateFormData.name}</h1> : <h1 style={{"color": "#e8e9f3"}}>Unnamed Template</h1>}
                                <input name="templateName" placeholder="Name of template" value = {templateFormData.name} onChange={handleFormChange}/>
                                <button type="button" onClick={addExercise} className="btn">Add an exercise</button>
                                {formInputs}
                                <button className="btn-purple">Save template</button>
                            </form>
                        </div>   
                    </Modal>

                    <button className="btn" onClick={openTemplateManagementModal} name="openTemplateManagementModal">Manage your templates</button>
                    <Modal
                        isOpen={showTemplateManagementModal}
                        onRequestClose={closeTemplateManagementModal}
                        style={modalStyles}
                        contentLabel = "manage your templates"
                    >
                        {!templateManagementBody.active && <h1 style={{"color": "#e8e9f3", "textAlign":"center", "fontSize": "50px"}}>Select an option below</h1>}
                        <div style={{"display":"flex", "justifyContent":"center", "gap": "32px", "alignItems":"center"}}>
                            {!templateManagementBody.active && <button className='btn-purple' onClick={e => setTemplateManagementBody({active: true, op: 'del'})}>Delete templates</button>}
                            {!templateManagementBody.active && <button className='btn-purple' onClick={e => setTemplateManagementBody({active: true, op: 'edit'})}>Edit templates</button>}
                        </div>
                        {
                            templateManagementBody.active && templateManagementBody.op === 'del' &&
                            <div>
                                <h1 style={{"color": "#e8e9f3", "textAlign":"center", "fontSize": "50px"}}>Choose templates to delete</h1>
                                <div style={{"display": "flex", "gap": "32px", "justifyContent":"center"}}>
                                    <button className='btn-purple' onClick={() => {
                                        setTemplateManagementBody({active: false, op: ''})
                                        setTemplateManagementSelections([])
                                        }}>Cancel</button>
                                    <button className='btn-purple' onClick={() => setTemplateManagementSelections([])}>Clear selections</button>
                                </div>
                                <div style={{"display": "flex", "justifyContent": "center", "gap": "20px", "flexDirection": "column", "alignItems": "center"}}>
                                    {templateManagementSelectionsButtons}
                                </div>
                                <div style={{"display": "flex", "justifyContent": "center"}}>
                                    <button className='btn-purple' onClick={handleTemplateManagementSubmit}>{`Confirm ${templateManagementBody.op === 'del' ? 'deletion' : 'editing'}${templateManagementBody.op === 'del' ? ' (This CANNOT be reversed)' : ''}`}</button>
                                </div>

                            </div>
                        }
                        {
                            templateManagementBody.active && templateManagementBody.op === 'edit' &&
                            <div>
                                {!templateFormData.id && <h1 style={{"color": "#e8e9f3", "textAlign":"center", "fontSize": "50px"}}>Choose a template to edit</h1>}
                                <div style={{"display": "flex", "gap": "32px", "justifyContent":"center", "flexDirection":"column", "alignItems":"center"}}>
                                    <button className='btn-purple' onClick={() => {
                                        setTemplateManagementBody({active: false, op: ''})
                                        setTemplateEditActive(false)
                                        }}>Cancel
                                    </button>
                                    {!templateEditActive && templateManagementSelectionsButtons}
                                    {templateEditActive && 
                                        <form onSubmit={handleTemplateUpdate}>
                                            {templateFormData.name ? <h1 style={{"color": "#e8e9f3"}}>{templateFormData.name}</h1> : <h1 style={{"color": "#e8e9f3"}}>Unnamed Template</h1>}
                                            <input name="templateName" placeholder="Name of template" value = {templateFormData.name} onChange={handleFormChange}/>
                                            <button type="button" onClick={addExercise} className="btn">Add an exercise</button>
                                            {formInputs}
                                            <button className="btn-purple">Update template</button>
                                        </form>
                                    }
                                </div>
                            </div>
                        }
                    </Modal>

                    <button onClick={openWorkoutTemplateModal} name="startTemplate" className="btn">
                        Start workout from template
                    </button>

                    <button onClick={startEmptyWorkout} name="newWorkout" className="btn">Start workout from scratch</button>

                    <Modal
                        isOpen={showTemplatesModal}
                        onRequestClose={closeWorkoutTemplateModal}
                        style={modalStyles}
                        contentLabel = "create a new template"
                    >
                        <h2 style={{"color": "#e8e9f3", "textAlign":"center", "fontSize": "50px"}}>Select a template to begin</h2>
                        <div style={{"display":"flex", "flexDirection": "column", "gap":"20px", "justifyContent": "center", "alignItems":"center"}}>
                            {templateSelections}
                        </div>
                    </Modal>

                </div>

                <h1 className='recent-workouts-header'>Recent Workouts</h1>
                
                <div className='recent-workouts'>
                    {/* {recentWorkouts.length > 1 && <CsvDownloadButton data={recentWorkouts} filename="workout_history.csv" className='btn'>Export workout history as csv</CsvDownloadButton>} */}
                    {recentWorkouts.length ? recentWorkouts : <h2 style={{"color": "#e8e9f3"}}>No workouts yet</h2>}
                </div>

            </div>
        </div>
    )
}