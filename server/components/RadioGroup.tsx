import { createElement } from "../../lib/templates";
import { ObjectId } from "mongodb";

interface RadioGroupProps<T> {
    legend: string;
    items: T[];
    selectedId: string | ObjectId | null;
    name: string;
    component: (item: T) => string;
    itemStyle: (item: T) => string;
}

export function RadioGroup<T extends { _id: string | ObjectId }>(props: RadioGroupProps<T>) {
    const { legend, items, selectedId, name, component, itemStyle } = props;
    return <fieldset class="radio-group">
        <legend class="for-screen-readers">{legend}</legend>
        {items.map(item => [
            <input type="radio" id={name + "-" + item._id} name={name} value={item._id.toString()} checked={selectedId === item._id} />,
            <label for={name + "-" + item._id} style={itemStyle(item)}>
                {component(item)}
            </label>
        ])}
    </fieldset>;
}
