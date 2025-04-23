import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Landing from "../components/Landing";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Landing">
                <Landing/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews