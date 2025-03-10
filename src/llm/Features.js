
// import {llm} from "./llm";

import {generateVectorEmbedding, rag} from "./vector";

async function Features() {


    let ragResponse = await rag("software that can  runs consistently across different environment")
    console.log(ragResponse)

    return (
        <div>
            <h1>This is for the testing</h1>


        </div>
    );
}

export default Features;