import CardPair from "./CardPair";

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

// wraps a div around the cardpair that allows it to be sorted
const SortableWrapper = (props) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: props.id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    // tbh the more i look at this, the less i understand about how this actually works
    const cardRef = (node) => {
        if (node) {
            props.cardsRef.set(props.id, node); // Store node in parent's Map
        }
        else {
            props.cardsRef.delete(props.id); // Remove from Map if unmounted
        }
    };

    return (
        <div ref={setNodeRef} style={style}>
            <CardPair {...props} listeners={listeners} attributes={attributes} ref={cardRef}></CardPair>
        </div>
    )
}

export default SortableWrapper;