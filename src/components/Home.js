import React from 'react'
import Workout from './Workout'
import workoutSummaryData from '../workoutSummaryData'
import workoutData from '../exampleWorkoutData'
import Modal from 'react-modal'
import './Home.css'

Modal.setAppElement('#root');

const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

export default function Home() {

    const [showModal, setShowModal] = React.useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = React.useState(false);
    const [templateFormData, setTemplateFormData] = React.useState([
        {
            exercise: '',
            numSets: 1,
            sets: [
                {
                    reps: 0,
                    weight: 0
                }
            ]
        }
    ]);

    let subtitle;

    function openModal() {
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    function afterOpenModal() {
        //do something
    }

    function openWorkoutModal() {
        setShowWorkoutModal(true);
    }



    // eventually add date and time here
    const recentWorkouts = workoutSummaryData.map((workout) => {
        return (
            <>
                <hr />
                <div onClick={openWorkoutModal}>
                    <p style={{fontsize: "100px"}}>{workout.title}</p>
                    <p>{workout.exercises} Exercises</p>
                </div>
                
            </>
        )
    });

    const buttonStyle = {
        height: '100px'
    }

    function createTemplate() {
        //toggleModal();
    }

    function addTemplateSet() {

    }

    /* 
    Home screen should contain the following things:
        
        - start a new workout
            - from template
            - empty workout
        
        - workout templates
            - create new template     
            - start workout from template

        - account management

    */
    return (
        <div className='home'>
            <nav className='home-nav'>
                Yacked!
                <img src='../images/logo-small.jpg' alt='logo-small' style={{width: "100px"}}/>
            </nav>
            <div className='content'>
                <div className='menu'>
                    <button onClick={openModal} name="create-template" style={buttonStyle}>
                        Create a workout template
                    </button>
                    <Modal
                        isOpen={showModal}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={modalStyles}
                        contentLabel = "create a new template"
                    >
                        <form>
                            <input name="templateName" placeholder="Name of template"/>
                            <button type="button" onClick={addTemplateSet}>Add an exercise</button>
                        </form>
                    </Modal>
                    <button onClick={createTemplate} name="startTemplate" style={buttonStyle}>
                        Start workout from template
                    </button>
                    <button style = {buttonStyle} onClick={createTemplate} name="startEmpty">
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