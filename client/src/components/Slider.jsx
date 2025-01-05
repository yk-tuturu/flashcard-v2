import { useState, forwardRef, useImperativeHandle } from "react";

import '../styles/App.scss';
import "../styles/Slider.scss";

const Slider = forwardRef((props, ref) => {
    const [slideValue, setSlideValue] = useState(props.min);

    useImperativeHandle(ref, () => {
        return {
            // sets slide value, can be called from parent via ref
            setValue(value) {
                setSlideValue(Math.max(props.min, Math.min(value, props.max))); 
                return;
            }
        }
    }, [props.max, props.min])

    function handleChange(e) {
        const tempSliderValue = e.target.value;
        setSlideValue(tempSliderValue);
        props.onUpdate(tempSliderValue); // sets slider value then calls onupdate in parent component
    }

    // calculate based on current slide value
    // the colours arent customizable tho... sounded like too much of a hassle to port the scss variables
    function calculateSlideStyle() {
        const progress = ((slideValue - props.min) / (props.max - props.min)) * 100;
        return { background: `linear-gradient(to right, rgb(81, 67, 93) ${progress}%, rgb(229, 225, 235) ${progress}%)` }
    }

    return (
        <input
            type="range"
            min={props.min}
            max={props.max}
            value={slideValue}
            className="slider"
            onChange={handleChange}
            style={calculateSlideStyle()}
        />
    )
})

export default Slider;