import {useState, forwardRef, useImperativeHandle} from "react";
import '../App.scss';
import "../Slider.scss";

const Slider = forwardRef((props, ref) => {
    const [slideValue, setSlideValue] = useState(props.min);

    useImperativeHandle(ref, ()=>{
            return {
                setValue(value) {
                    setSlideValue(Math.max(props.min, Math.min(value, props.max)));
                    return;
                }
            }
    }, [props.max, props.min])

    function handleChange(e) {
        const tempSliderValue = e.target.value;
        setSlideValue(tempSliderValue);
        props.onUpdate(tempSliderValue);
    }

    function calculateSlideStyle() {
        const progress = ((slideValue-props.min)/(props.max-props.min)) * 100;
        return {background: `linear-gradient(to right, rgb(81, 67, 93) ${progress}%, rgb(229, 225, 235) ${progress}%)`}
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