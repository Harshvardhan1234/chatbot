import {pipeline} from '@huggingface/transformers';

import {addDataToIndexedDB, similaritySearchResult} from './dataBase';
import {llm} from "./llm";


const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');


function convertListOfSentences(paragraph) {
    const cleanedParagraph = paragraph.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanedParagraph.split(/(?<=\.|!|\?)\s+/);    //  /(?<=\.|!|\?)\s+/
}

export async function generateVectorEmbedding(data) {
    let  vectorData = []
    for(const sentence of convertListOfSentences(data)){
        const output = await extractor(sentence, {pooling: 'mean', normalize: true});
        vectorData.push( { text: sentence, embedding: output.data });
    }
    addDataToIndexedDB( vectorData);
}

export async function rag(prompt) {
    const output = await extractor(prompt, {pooling: 'mean', normalize: true});
    // return await similaritySearchResult(output.data, 3);
    const similarResults =  await similaritySearchResult(output.data, 3);


    let responseCount = 1;
    let similarResultsString = ""
    for(const response of similarResults){
        if (response !== undefined && response !== null) {
            similarResultsString += `result ${responseCount} => ${response.text} \n`; // Adding a newline for better readability
            responseCount++;
        } else {
            console.error("Warning: A response in similarResults is undefined or null.");
        }
    }


    let ragPrompt = `
I have performed the RAG (Retrieval-Augmented Generation) operation for the given question:

Question: ${prompt}

After performing the similarity search, I found the following related results:

${similarResultsString}

Based on the question and the results of the similarity search, please provide a concise and accurate answer.

**Important:** 
- If the question is unrelated to the provided answers, please respond with: **"NO SIMILAR RESPONSE FOUND"**.
- Ensure that your response is relevant to the question asked, and consider the similarity search results when crafting your answer.

`;

    // console.log(ragPrompt)
    return await llm(ragPrompt);
}


// let tt = await rag("software that can  runs consistently across different environment")

// console.log("vvv")
// console.log(tt)
















// const paragraph = `Xenova
// /\nall-MiniLM-L6-v2
// like
// 66
// Feature Extraction
// Transformers.js
// ONNX
// bert
// License:
// apache-2.0
// Model card
// Files
// Community
// 4
// Use this model
//
// https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2 with ONNX weights to be compatible with Transformers.js.
//
// Usage (Transformers.js)
//
// If you haven't already, you can install the Transformers.js JavaScript library from NPM using:
//
// npm i @huggingface/transformers
//
// You can then use the model to compute embeddings like this:
//
// import { pipeline } from '@huggingface/transformers';
//
// // Create a feature-extraction pipeline
// const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
//
// // Compute sentence embeddings
// const sentences = ['This is an example sentence', 'Each sentence is converted'];
// const output = await extractor(sentences, { pooling: 'mean', normalize: true });
// console.log(output);
// // Tensor {
// //   dims: [ 2, 384 ],
// //   type: 'float32',
// //   data: Float32Array(768) [ 0.04592696577310562, 0.07328180968761444, ... ],
// //   size: 768
// // }
//
// You can convert this Tensor to a nested JavaScript array using .tolist():
//
// console.log(output.tolist());
// // [
// //   [ 0.04592696577310562, 0.07328180968761444, 0.05400655046105385, ... ],
// //   [ 0.08188057690858841, 0.10760223120450974, -0.013241755776107311, ... ]
// // ]
//
// Note: Having a separate repo for ONNX weights is intended to be a temporary solution until WebML gains more traction. If you would like to make your models web-ready, we recommend converting to ONNX using 🤗 Optimum and structuring your repo like this one (with ONNX weights located in a subfolder named onnx).
//
// Downloads last month
// 177,390
// Inference Providers
// NEW
// Feature Extraction
// This model is not currently available via any of the supported Inference Providers.
// The model cannot be deployed to the HF Inference API: The HF Inference API does not support feature-extraction models for transformers.js library.
// Model tree for
// Xenova/all-MiniLM-L6-v2
//
// Base model
//
// sentence-transformers/all-MiniLM-L6-v2
// Quantized
// (26)
// this model
// Spaces using
// Xenova/all-MiniLM-L6-v2
// 2
// 🐠
// Xenova/webgpu-embedding-benchmark
// 🐠
// fantos/webgpu-embedding-benchmark
// System theme
// Company
// TOS
// Privacy
// About
// Jobs
// Website
// Models
// Datasets
// Spaces
// Pricing
// Docs`;
//
//
//
// const testData = `It uses quantum bits (qubits) that can exist in multiple states simultaneously (superposition). This allows it to solve certain problems, like factoring large numbers, exponentially faster than classical systems.
//
// In this type of learning, a model is trained on labeled data, while the other type uses unlabeled data to find patterns. The third type involves an agent that learns by interacting with an environment and receiving feedback in the form of rewards or punishments.
//
// This is a decentralized, distributed ledger technology that records transactions across multiple computers. Each block contains data, a timestamp, and a link to the previous block, ensuring the integrity of the chain.
//
// This allows data and applications to be hosted on remote servers, accessed via the internet. Major models include Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).
//
// These are lightweight, portable units that package applications and their dependencies. Docker is a popular tool for ensuring that software runs consistently across different environments.
//
// These systems use algorithms to perform tasks that typically require human intelligence, such as visual perception, decision-making, and language understanding. One common approach is deep learning, which uses neural networks with many layers to extract complex patterns from data.
//
// This is the fifth generation of mobile network technology. It promises faster data speeds (up to 100 times faster than its predecessor), lower latency, and the ability to support a massive number of connected devices, enabling innovations in IoT and autonomous vehicles.
//
// This type of development focuses on the user interface (UI) and user experience (UX) of a website or application. It involves HTML, CSS, JavaScript, and frameworks like React, Angular, or Vue.js to create dynamic, responsive web pages.
//
// This allows multiple operating systems to run on a single physical machine, using a hypervisor to manage resources. This increases hardware utilization and provides flexibility in running different workloads on the same infrastructure.
//
// This is a set of practices that combines software development and IT operations. It emphasizes automation, continuous integration (CI), continuous delivery (CD), and collaboration between developers and operations teams to improve software delivery efficiency.
// `


// convertListOfSentences(testData)
// generateVectorEmbedding(testData).then(t=>console.log("END"));
