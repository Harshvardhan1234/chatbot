export function addDataToIndexedDB(data) {

    const request = indexedDB.open("vector_database", 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("vector_embeddings")) {
            db.createObjectStore("vector_embeddings", { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        const transaction = db.transaction("vector_embeddings", 'readwrite');
        const store = transaction.objectStore("vector_embeddings");


        data.forEach(item => {
            const addRequest = store.add(item);

            addRequest.onsuccess = function () {
                console.log('Data added successfully:', item);
            };

            addRequest.onerror = function (event) {
                console.error('Error adding data:', event.target.error);
            };
        });
        transaction.oncomplete = function () {
            db.close();
        };
    };
    request.onerror = function (event) {
        console.error('Error opening database:', event.target.error);
    };
}



export function similaritySearchResult(queryEmbedding, k) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("vector_database", 1);

        request.onsuccess = function(event) {
            const db = event.target.result;
            retrieveData(db, queryEmbedding, resolve, reject, k);
        };

        request.onerror = function(event) {
            console.error('Error opening IndexedDB:', event.target.error);
            reject('Error opening IndexedDB');
        };
    });
}

function retrieveData(db, queryEmbedding, resolve, reject, k) {
    const transaction = db.transaction('vector_embeddings', 'readonly');
    const store = transaction.objectStore('vector_embeddings');
    const request = store.openCursor();

    const results = [];

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            const record = cursor.value;
            const embedding = record.embedding;
            const similarity = calculateCosineSimilarity(queryEmbedding, embedding);

            results.push({ id: record.id, text: record.text, similarity: similarity });

            cursor.continue();
        } else {
            results.sort((a, b) => b.similarity - a.similarity);
            const topResults = results.slice(0, k);
            // console.log('Top 10 Results:', topResults);
            resolve(topResults);
        }
    };

    request.onerror = function(event) {
        console.error('Error retrieving data from IndexedDB:', event.target.error);
        reject('Error retrieving data from IndexedDB');
    };
}

function calculateCosineSimilarity(vec1, vec2) {
    if (!(vec1 instanceof Float32Array) || !(vec2 instanceof Float32Array)) {
        throw new Error('Input vectors must be Float32Arrays');
    }

    const dotProduct = vec1.reduce((sum, value, i) => sum + value * vec2[i], 0);

    const magnitude1 = Math.sqrt(vec1.reduce((sum, value) => sum + value * value, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, value) => sum + value * value, 0));

    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
}





//
// export function similaritySearchResult(queryEmbedding) {
//
//     const request = indexedDB.open("vector_database", 1);
//
//     request.onsuccess = function(event) {
//         const db = event.target.result;
//         retrieveData(db, queryEmbedding);
//     };
//     request.onerror = function(event) {
//         console.error('Error opening IndexedDB:', event.target.error);
//     };
// }
//
//
//
// function retrieveData(db, queryEmbedding) {
//     const transaction = db.transaction('vector_embeddings', 'readonly');
//     const store = transaction.objectStore('vector_embeddings');
//     const request = store.openCursor();
//
//     const results = [];
//
//     request.onsuccess = function(event) {
//         const cursor = event.target.result;
//         if (cursor) {
//             const record = cursor.value;
//             const embedding = record.embedding;
//             const similarity = calculateCosineSimilarity(queryEmbedding, embedding);
//
//             results.push({ id: record.id, text: record.text, similarity: similarity });
//
//             cursor.continue();
//         } else {
//
//             results.sort((a, b) => b.similarity - a.similarity);
//             console.log(results.slice(0, 10))
//
//         }
//     };
//
//     request.onerror = function(event) {
//         console.error('Error retrieving data from IndexedDB:', event.target.error);
//     };
// }
//
//
//
//
//
// function calculateCosineSimilarity(vec1, vec2) {
//
//     if (!(vec1 instanceof Float32Array) || !(vec2 instanceof Float32Array)) {
//         throw new Error('Input vectors must be Float32Arrays');
//     }
//
//     const dotProduct = vec1.reduce((sum, value, i) => sum + value * vec2[i], 0);
//
//
//     const magnitude1 = Math.sqrt(vec1.reduce((sum, value) => sum + value * value, 0));
//     const magnitude2 = Math.sqrt(vec2.reduce((sum, value) => sum + value * value, 0));
//
//     if (magnitude1 === 0 || magnitude2 === 0) {
//         return 0;
//     }
//
//     return dotProduct / (magnitude1 * magnitude2);
// }
//















