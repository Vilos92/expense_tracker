import React from 'react';

import { Workout } from './workout.jsx';


export function CalendarDay(props) {
    const calendar_day = props.calendar_day;
    const workouts = props.workouts;
    const exercise_attempts = props.exercise_attempts;
    const exercise_sets = props.exercise_sets;
    const exercises = props.exercises;

    const remove_workout = props.remove_workout;

    let workout_items = [];
    for (let i = 0; i < calendar_day.workouts.length; ++i) {
        const workout_id = calendar_day.workouts[i];
        const workout = workouts[workout_id];
        const workout_data = workout.data;

        const row = i + 1;

        workout_items.push(
                <Workout key={workout_id} row={row} workout={workout_data}
                            exercise_attempts={exercise_attempts}
                            exercise_sets={exercise_sets}
                            exercises={exercises} 
                            remove_workout={remove_workout}/>
        );
    }

    return (
        <div>
            {workout_items}
        </div>
    );
}
