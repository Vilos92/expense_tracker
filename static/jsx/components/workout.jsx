import utils_style from '~/../scss/utils.scss';
import workout_style from '~/../scss/workout.scss';


import React from 'react';
import { Link } from 'react-router-dom';

import converter from 'number-to-words';

import Panel from './panel.jsx'; 
import { FoundationCloseButton } from '~/components/foundation.jsx';
import FontAwesomeIcon from './font-awesome.jsx'; 


function ExerciseAttempt(props) {
    if (!props.exercise_attempt) {
        return null;
    }

    const exercise_attempt = props.exercise_attempt.data;
    const exercise = props.exercise.data;
    const exercise_name = exercise.name;

    const set_count = exercise_attempt.exercise_sets.length;

    const set_count_content = `${set_count} Sets`;
    
    return (
        <div>
            <span className="workout-exercise-name">
                {exercise_name}
            </span>
            <span className="workout-exercise-set-count">
                {set_count_content}
            </span>
        </div>
    );
}


export class Workout extends React.Component {
    constructor(props) {
        super(props);

        this.handleRemoveWorkout = this.handleRemoveWorkout.bind(this);
    }
    
    handleRemoveWorkout() {
        const workout_id = this.props.workout.id;
        this.props.remove_workout(workout_id);
    }

    render() {
        const workout = this.props.workout;
        const exercise_attempts = this.props.exercise_attempts;
        const exercises = this.props.exercises;

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
                                        exercise={exercise} />
                );
            }

            exercise_attempt_content = exercise_attempt_items;
        }

        const ordinal_row = converter.toWordsOrdinal(this.props.row);

        const identifier = (
            <Link to={`/workout/${workout.id}`}>
                <div className="workout-identifier">
                    <span className="capitalize">
                        {ordinal_row} Workout <FontAwesomeIcon icon_class="pencil-square-o" />
                    </span>
                </div>
            </Link>
        );

        return (
            <Panel>
                <FoundationCloseButton size="3x" float_right={true}
                    onClick={this.handleRemoveWorkout} />

                {identifier}
                {exercise_attempt_content}
            </Panel>
        );
    }
}
