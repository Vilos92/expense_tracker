import React from 'react';
import { Link } from 'react-router-dom';

import capitalize from 'capitalize';

import Panel from '~/components/panel.jsx'; 
import IconButton from '~/components/icon-button.jsx';
import { FoundationDropDown, FoundationCloseButton } from '~/components/foundation.jsx';


function ExerciseDropdown(props) {
    const exercises = props.exercises;

    const label = 'Exercises:'

    const rows = exercises.map((exercise) => {
        const exercise_name = capitalize.words(exercise.name);

        return {
            value: exercise.id,
            text: exercise_name
        };
    });
    
    const value = props.value;

    return (
        <FoundationDropDown label={label} rows={rows}
            onChange={props.onChange} value={value} />
    );
}


function ExerciseSet(props) {
    const exercise_set = props.exercise_set;

    return (
        <div className="workout-view-exercise-set">
            {exercise_set.reps} Reps X {exercise_set.weight} Ibs
        </div>
    );
}


class ExerciseAttempt extends React.Component {
    constructor(props) {
        super(props);

        this.handleRemove = this.handleRemove.bind(this);
    }

    handleRemove() {
        const exercise_attempt = this.props.exercise_attempt.data;
        const exercise_attempt_id = exercise_attempt.id;

        this.props.handleRemoveExerciseAttempt(exercise_attempt_id);
    }

    render() {
        if (!this.props.exercise_attempt) {
            return null;
        }

        const exercise_attempt = this.props.exercise_attempt.data;
        const exercise_attempt_id = exercise_attempt.id;

        const exercise = this.props.exercise.data;
        const exercise_name = capitalize.words(exercise.name);

        const exercise_sets = this.props.exercise_sets;
        const set_count = exercise_attempt.exercise_sets.length;

        const exercise_header = (
            <Link to={`/exercise_attempt/${exercise_attempt.id}`}>
                {exercise_name} ({set_count} Sets)
            </Link>
        );

        let exercise_set_rows = [];
        for (let i = 0; i < set_count; ++i) {
            const exercise_set_id = exercise_attempt.exercise_sets[i];
            const exercise_set = exercise_sets[exercise_set_id].data;

            exercise_set_rows.push(
                <ExerciseSet key={exercise_set_id} exercise_set={exercise_set} />
            );
        }
        
        return (
            <Panel>
                <FoundationCloseButton size="3x" float_right={true}
                    onClick={this.handleRemove} />

                <span className="workout-view-exercise-header">
                    {exercise_header}
                </span>

                {exercise_set_rows}
            </Panel>
        );
    }
}


export function WorkoutContent(props) {
    const workout = props.workout;
    const exercise_attempts = props.exercise_attempts;
    const exercise_sets = props.exercise_sets;
    const exercises = props.exercises;

    let exercise_attempt_content;
    if (workout.exercise_attempts.length < 1) {
        exercise_attempt_content = (
            <h4>No exercises have been added to this workout.</h4>
        );
    } else {
        let exercise_attempt_items = [];

        for (let i = 0; i < workout.exercise_attempts.length; ++i) {
            const exercise_attempt_id = workout.exercise_attempts[i];
            const exercise_attempt = exercise_attempts[exercise_attempt_id];

            const exercise_id = exercise_attempt.data.exercise;
            const exercise = exercises[exercise_id];

            exercise_attempt_items.push(
                <ExerciseAttempt key={exercise_attempt_id} exercise_attempt={exercise_attempt}
                                    exercise_sets={exercise_sets} exercise={exercise}
                                    handleRemoveExerciseAttempt={props.handleRemoveExerciseAttempt} />
            );
        }

        exercise_attempt_content = exercise_attempt_items;
    }

    return (
        <div>
            {exercise_attempt_content}
        </div>
    );
}


export default class WorkoutEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {selected_exercise_id: ''};

        this.handleAddExerciseAttempt = this.handleAddExerciseAttempt.bind(this);
        this.handleRemoveExerciseAttempt = this.handleRemoveExerciseAttempt.bind(this);
        this.handleExerciseOnChange = this.handleExerciseOnChange.bind(this);
    }

    handleAddExerciseAttempt() {
        if (this.state.selected_exercise_id) {
            this.props.add_exercise_attempt(this.props.workout.id, this.state.selected_exercise_id);
            this.setState({selected_exercise_id: ''});
        }
    }

    handleRemoveExerciseAttempt(exercise_attempt_id) {
        this.props.remove_exercise_attempt(this.props.workout_id, exercise_attempt_id);
    }

    handleExerciseOnChange(event) {
        const selected_exercise_id = event.target.value;
        this.setState({selected_exercise_id});
    }

    render() {
        const workout = this.props.workout;
        const exercise_attempts = this.props.exercise_attempts;
        const exercise_sets = this.props.exercise_sets;
        const exercises = this.props.exercises;

        const workout_exercise_attempts = workout.exercise_attempts;


        // Get set of existing exercises to exclude from dropdown
        let existing_exercise_ids = new Set();
        for (let i = 0; i < workout_exercise_attempts.length; ++i) {
            const exercise_attempt_id = workout_exercise_attempts[i];

            if (exercise_attempts.hasOwnProperty(exercise_attempt_id)) {
                const exercise_attempt = exercise_attempts[exercise_attempt_id].data;
                const exercise_id = exercise_attempt.exercise;

                existing_exercise_ids.add(exercise_id);
            }
        };

        // Get list of new exercises for dropdown
        let dropdown_exercises = [];
        for (let exercise_id in exercises) {
            if (exercises.hasOwnProperty(exercise_id)) {
                const exercise = exercises[exercise_id].data;

                if (exercise) {
                    if (existing_exercise_ids.has(exercise.id)) {
                        continue;
                    }

                    dropdown_exercises.push(exercise);
                }
            }
        } 

        let add_exercise_button = null;
        if (this.state.selected_exercise_id !== '') {
            add_exercise_button = (
                <IconButton icon_class="plus-square" onClick={this.handleAddExerciseAttempt}
                        large={true} expanded={true}>
                    Add Exercise Attempt
                </IconButton>
            );
        }
        
        return (
            <div>
                <ExerciseDropdown exercises={dropdown_exercises}
                    value={this.state.selected_exercise_id}
                    onChange={this.handleExerciseOnChange} />
                {add_exercise_button}

                <WorkoutContent workout={this.props.workout}
                            exercise_attempts={this.props.exercise_attempts}
                            exercise_sets={this.props.exercise_sets}
                            exercises={this.props.exercises}
                            handleRemoveExerciseAttempt={this.handleRemoveExerciseAttempt} />
            </div>
        );
    }
}
