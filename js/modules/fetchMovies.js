import {
    successPopup,
    errorPopup,
    startLoadingAnimation,
    endLoadingAnimation
} from './interactions.js';

import {
    newCollectionNameErrorChecks
} from './userUpdates.js';

var movies_collections_object;

document.querySelector(".search-button").addEventListener("click", e => {
    e.preventDefault()

    let searchText = document.querySelector(".search-input").value;
    searchText = searchText.trim();

    displayMovies(searchText);
});
const apiKey = 'apikey=ed063e77';

const displayMovies = (searchText) => {

    startLoadingAnimation(document.querySelector(".search-button"), document.querySelector(".search-loader"), document.querySelector(".search-btn-text"));

    axios.get('https://www.omdbapi.com/?s=' + searchText + '&'+apiKey)
        .then((res) => {
          
            const sortedMovies = res.data.Search.sort(sortByReleaseYearAscending);   
            document.querySelector("#movies").innerHTML = '';
            for (let i = 0; i < sortedMovies.length; i++) {
            
                if (sortedMovies[i].Type === "movie" || sortedMovies[i].Type == "series") {
             
                    if (sortedMovies[i].Poster !== "N/A") {

                        document.querySelector("#movies").innerHTML +=
                            `
                        <div class="movie-container">
                            <div class="movie-image">
                                <img src=${sortedMovies[i].Poster} alt="${sortedMovies[i].Title} Poster Image" class="skeleton">
                            </div>

                            <div class="movie-content">
                                <div class="add-content-container">
                                    <div>
                                        <h2 class="movie-name">${sortedMovies[i].Title}</h2>
                                        <p class="movie-release-date">Data: ${sortedMovies[i].Year}</p>
                                    </div>

                                    <div class="add-to-collection">                                     
                                        <span class="material-icons-outlined icon" id="info_${sortedMovies[i].imdbID}">info</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    }
                }
            }       
            endLoadingAnimation(document.querySelector(".search-button"), document.querySelector(".search-loader"), document.querySelector(".search-btn-text"));

        }).catch(() => {          
            endLoadingAnimation(document.querySelector(".search-button"), document.querySelector(".search-loader"), document.querySelector(".search-btn-text"));      
            errorPopup("Não foi encontrado nome de Filme ou Série", 5000);
        });
}

document.querySelector("#movies").addEventListener("click", (e) => {
 
    if (e.target.id[0] === "t") {  
        const movieID = e.target.id;
        const movieTitle = e.target.parentElement.parentElement.children[0].children[0].innerText;
        const moviePoster = e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].src;

        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((doc) => {
                const moviesCollection = doc.data().movies_collections
                movies_collections_object = moviesCollection;
                document.querySelector(".collections-modal").classList.toggle("hidden");
                document.querySelector(".collections-modal-header").innerText = "Add to a Collection"
                document.querySelector("#current-movie-poster").src = moviePoster;
                document.querySelector("#current-movie-poster").alt = movieTitle + " Poster Image";

                if (Object.keys(moviesCollection).length === 0) {
                    document.querySelector(".collections-modal-collections").innerHTML =
                        `
                    <div class="create-new-collection-form" style="width: 100%;">
                        <input type="text" id="create-collection-name" placeholder="Crie sua primeira Coleção">
                        <button class="create-collection-btn" id="create-first-collection-btn" type="submit" data-imdbID="${movieID}"
                        data-title="${movieTitle}">Create</button>
                    </div>
                    `
                }

                Object.keys(moviesCollection).forEach(collection => {
                    const collectionName = collection.replace(/\s+/g, ' ').trim();
                    document.querySelector(".collections-modal-collections").innerHTML +=
                        `
                        <div class="collection-wrapper">
                            <h3 class="collection-name">${collectionName}</h3>
                            <span 
                                class="material-icons icon collection-button" 
                                id="${collectionName}" 
                                data-imdbID="${movieID}"
                                data-title="${movieTitle}"
                                data-active="true"
                                style="margin-left: 30px"
                                >add
                            </span>
                        </div>
                        `
                })

                document.querySelectorAll(".collection-button").forEach(collection => {
                    if (movies_collections_object[collection.id].movies.includes(movieID)) {
                        collection.innerHTML = "check";
                        collection.style.color = "green";
                        collection.dataset.active = "false";
                        collection.style.cursor = "default";
                    }
                })
            })
    }

    if (e.target.id.includes("info")) {
        const imdbID = e.target.id.split("_")[1];

        axios.get('https://www.omdbapi.com/?i=' + imdbID + '&plot=full&'+apiKey)
        .then((res) => {

            const year_released = res.data.Released;
            const runtime = res.data.Runtime;
            const ratings = res.data.imdbRating;
            const vote_count = res.data.imdbVotes;
            const actors = res.data.Actors.split(",");
            const director = res.data.Director;
            const plot = res.data.Plot;

            document.querySelector(".collections-modal").classList.toggle("hidden");
            document.querySelector(".collections-modal-header").innerText = res.data.Title; 
            // document.querySelector("#current-movie-poster").src = res.data.Poster;
            // document.querySelector("#current-movie-poster").alt = res.data.Title + " Poster Image";

            document.querySelector(".collections-modal-collections").innerHTML = `
            <div class="movie-info-holder">
                <div class="movie-info-title">Ano Lançamento:</div>
                <div class="movie-info-content">${year_released}</div>
            </div>
            <div class="movie-info-holder">
                <div class="movie-info-title">Duração:</div>
                <div class="movie-info-content">${runtime}</div>
            </div>
            <div class="movie-info-holder">
                <div class="movie-info-title">Classificação:</div>
                <div class="movie-info-content">${ratings}</div>
            </div>
            <div class="movie-info-holder">
                <div class="movie-info-title">Votos:</div>
                <div class="movie-info-content">${vote_count}</div>
            </div>
            <div class="movie-info-holder">
                <div class="movie-info-title">Diretor(es):</div>
                <div class="movie-info-content">${director}</div>
            </div>
            <div class="movie-info-holder">
                <div class="movie-info-title">Atores:</div>
                <div class="movie-info-actors-content"></div>
            </div>
            <div class="movie-info-holder plot-container">
                <div class="movie-info-title plot-heading">Sinopse:</div>
                <div class="movie-info-content" style="line-height:1.5">${plot}</div>
            </div>
            `
            
            actors.forEach(actor => {           
                actor.replace(/\s+/g, ' ').trim();
                document.querySelector(".movie-info-actors-content").innerHTML += `
                    <div class="movie-info-content">${actor}</div>
                `
            })
        })
    }
});


document.querySelector(".collections-modal ").addEventListener("click", (e) => {


    if (e.target.classList.contains("collection-button") && e.target.dataset.active === "true") {
        const collectionName = e.target.parentElement.children[0].textContent.replace(/\s+/g, ' ').trim();
        const imdbID = e.target.dataset.imdbid; 
        const movieName = e.target.dataset.title;
        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        user_doc_ref.update({
            [`movies_collections.${collectionName}.movies`]: firebase.firestore.FieldValue.arrayUnion(imdbID)
        }).then(() => {
            successPopup(`Added ${movieName} to your ${collectionName} collection`)
            e.target.textContent = "check"
            e.target.style.color = "green"
            e.target.dataset.active = "false";
        }).catch((err) => {
            errorPopup(`Couldn't add ${movieName} to your ${collectionName} collection. Please try again`, 5000)
        })
    }

    if (e.target.id === "create-first-collection-btn") {
        e.preventDefault();

        const movieID = e.target.dataset.imdbid;
        const movieTitle = e.target.dataset.title;
        const collectionName = document.querySelector("#create-collection-name").value;
        newCollectionNameErrorChecks(collectionName);

        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        if (newCollectionNameErrorChecks(collectionName)) {
         
            user_doc_ref.get().then((doc) => {
                if (doc.data().movies_collections[collectionName]) {
                    errorPopup(`${collectionName} is already a collection`, 5000)
                    document.querySelector("#create-collection-name").value = "";
                    return
                } else {              
                    const timestamp = firebase.firestore.FieldValue.serverTimestamp();            
                    user_doc_ref.set({
                        movies_collections: {                            
                            [collectionName]: {
                                dateCreated: timestamp,
                                createdBy: firebase.auth().currentUser.email,
                                movies: []
                            }
                        }
                    }, {
                        merge: true
                    }).then(() => {                 
                        successPopup(`Created ${collectionName} collection`)                
                        document.querySelector(".collections-modal-collections").innerHTML = "";            
                        document.querySelector(".collections-modal-collections").innerHTML +=
                            `
                        <div class="collection-wrapper">
                            <h3 class="collection-name">${collectionName}</h3>
                            <span 
                                class="material-icons icon collection-button" 
                                id="${collectionName}" 
                                data-imdbID="${movieID}"
                                data-title="${movieTitle}"
                                style="margin-left: 30px"
                                >add</span>
                        </div>
                        `     
                        user_doc_ref.update({
                            [`movies_collections.${collectionName}.movies`]: firebase.firestore.FieldValue.arrayUnion(movieID)
                        }).then(() => {                         
                            document.querySelector(".collection-button").textContent = "check"
                            document.querySelector(".collection-button").style.color = "green"
                        })
                    })
                }
            })
        }
    }
})

function sortByReleaseYearDescending(a, b) {
    if (a.Year < b.Year) return 1;
    if (a.Year > b.Year) return -1;
    return 0;
}

function sortByReleaseYearAscending(a, b) {
    if (a.Year < b.Year) return -1;
    if (a.Year > b.Year) return 1;
    return 0;
}

document.querySelector("#close-collections-modal").addEventListener("click", () => {
    document.querySelector(".collections-modal-collections").scrollTop = 0;
    document.querySelector(".collections-modal").classList.toggle("hidden");
    document.querySelector(".collections-modal-collections").innerHTML = "";
});