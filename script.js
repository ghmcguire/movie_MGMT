let allMovies = [];

// Define a movie class with parameters title (string), rating (number) and haveWatched (boolean)
class Movie {
    constructor(title, rating, haveWatched) {
        this.title = title;
        this.rating = rating;
        this.haveWatched = haveWatched;
    }
}

// add a movie OBJECT to the allMovies array
let addMovie = (movie) => {
    allMovies.push(movie);
    console.log("A new movie is added");
    notify(movie.title + " was added", "success");
}

// iterate through all elements of allMovies array
// Display the total number of movies in allMovies array
let printMovies = () => {
    clearTable()
    console.log("Printing all movies....");
    allMovies.forEach(movie => {
        console.log(movie.title + ", rating of " + movie.rating + ", havewatched: " + movie.haveWatched);
        displayMovie(movie);
    });
    console.log("");
    console.log("You have " + allMovies.length + " movies in total");
    document.getElementById("total").innerHTML = 'You have <b>' + allMovies.length + '</b> movies in total';

}


//Display only the movies that has a rating higher than rating(argument)
//Display the total number of matches
let highRatings = (rating) => {
    if (rating === "") {
        notify("Please enter a rating to filter", "danger");
        return;
    } else if (rating < 0 || rating > 5) {
        notify("Please enter a rating to filter between 0 and 5", "danger");
        return;
    }
    let matches = allMovies.filter(movie => movie.rating >= rating);
    if (matches.length === 0) {
        notify("No movies with a rating of at least " + rating + " found. Showing all movies.", "danger");
        printMovies();
        return;
    }
    console.log("printing movie that has a rating higher than " + rating);
    clearTable()
    matches.forEach(movie => {
        console.log(movie.title + " has a rating of " + movie.rating);
        displayMovie(movie);
    });
    console.log("");
    console.log("In total, there are " + matches.length + " matches");
    notify("Filtered for movies with a rating of at least " + rating, "success");
    document.getElementById("total").innerHTML = 'You have <b>' + matches.length + '</b> matches ';
}


// Toggle the 'haveWatched' property of the specified movie 
let changeWatched = (title) => {
    console.log("changing the status of the movie...");
    let movie = allMovies.find(movie => movie.title === title);
    movie.haveWatched = !movie.haveWatched;
    notify(title + " was marked as " + (movie.haveWatched ? "watched" : "unwatched") , "success");
}


// Display a movie in the table
let displayMovie = (movie) => {
    let table = document.getElementById("movieTable");
    let row = table.insertRow(0);
    let title = row.insertCell(0);
    let rating = row.insertCell(1);
    let watched = row.insertCell(2);
    let remove = row.insertCell(3);
    title.innerHTML = movie.title;
    rating.innerHTML = starRating(movie.rating) + " (" + movie.rating + ")";
    watched.innerHTML = "<div class='form-check'><input class='form-check-input' type='checkbox' value='' id='flexCheckChecked' " + (movie.haveWatched ? "checked" : "") + " ></div>";
    remove.innerHTML = "<button type='button' class='btn btn-danger'>Delete</button>";
    addCheckBoxListener(watched);
}

// Toggle movie status with checkbox
function addCheckBoxListener(checkbox) {
    checkbox.addEventListener("click", (event) => {
        if (event.target.type === "checkbox") {
            let title = event.target.parentElement.parentElement.parentElement.cells[0].innerHTML;
            changeWatched(title);
            event.target.outerHTML = "<input class='form-check-input' type='checkbox' value='' id='flexCheckChecked' " + (event.target.checked ? "checked" : "") + " >";
        }
    });
}

// Event listener to remove a movie
document.getElementById("movieTable").addEventListener("click", (event) => {
    if (event.target.type === "button" && event.target.innerHTML === "Delete") {
        let title = event.target.parentElement.parentElement.cells[0].innerHTML;
        let movie = allMovies.find(movie => movie.title === title);
        let index = allMovies.indexOf(movie);
        allMovies.splice(index, 1);
        let rating = document.getElementById("ratingFilter").value;
        if (rating == "") {
            printMovies();

        } else {
            highRatings(rating);
        }
        notify(title + " was removed", "danger");
    }
});

// Event listener to add a movie
document.getElementById("addMovie").addEventListener("click", () => {
    let title = document.getElementById("title").value;
    let rating = document.getElementById("rating").value;
    let watched = document.getElementById("watched").checked;
    if (title === "") {
        notify("Please enter a title to add a movie", "danger");
        return;
    } else if (rating === "") {
        notify("Please enter a rating to add a movie", "danger");
        return;
    } else if (rating < 0 || rating > 5) {
        notify("Please enter a rating between 0 and 5", "danger");
        return;
    }
    let movie = new Movie(title, rating, watched);
    addMovie(movie);
    let ratingFilter = document.getElementById("ratingFilter").value;
    if (ratingFilter == "") {
        printMovies();
    } else if (rating >= ratingFilter) {
        highRatings(ratingFilter);
    } else {
        printMovies();
        document.getElementById("ratingFilter").value = "";
        notify("Movie rating less than filter. Filter cleared.", "primary");
    }
    document.getElementById("title").value = "";
    document.getElementById("rating").value = "";
});

// Filter movie event listener
document.getElementById("filter").addEventListener("click", () => {
    let rating = document.getElementById("ratingFilter").value;
    highRatings(rating);
});


// Generate star rating
let starRating = (rating) => {
    let star = "";
    for (let i = 0; i < rating; i++) {
        star += "⭐";
    }
    return star;
}

// Clear the ratings filter
document.getElementById("clearFilter").addEventListener("click", () => {
    document.getElementById("ratingFilter").value = "";
    // document.getElementById("clearFilter").classList.add("btn-disabled");
    printMovies();
    notify("Rating filter cleared", "success");
});

// Delete all movies from the array and clear the table
document.getElementById("deleteAll").addEventListener("click", () => {
    allMovies = [];
    console.log("All movies deleted");
    notify("All movies deleted", "danger");
    printMovies();
});

// Clear table
function clearTable() {
    document.getElementById("movieTable").innerHTML = "";
}

// Add notification with enter and exit animation
function notify(message, type) {
    let notification = document.createElement("div");
    notification.classList.add("alert");
    notification.classList.add("alert-" + type);
    notification.classList.add("enter");
    notification.setAttribute("role", "alert");
    notification.innerHTML = message;
    notificationWrapper = document.getElementById("notifications");
    notificationWrapper.appendChild(notification);
    notificationWrapper.scrollTo(0, notificationWrapper.scrollHeight);
    //remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add("exit");
        setTimeout(() => {
            notificationWrapper.removeChild(notification);
        }, 500);
    }, 3000);
}

// Toggle New Movie Card
document.getElementById("toggleNewMovie").addEventListener("click", () => {
    let newMovieCard = document.getElementById("newMovieCard");
    newMovieCard.classList.toggle("collapse");
    document.getElementById("toggleNewMovie").innerHTML = newMovieCard.classList.contains("collapse") ? "Show" : "Hide";
});

// Toggle Filter Card
document.getElementById("toggleFilter").addEventListener("click", () => {
    let filterCard = document.getElementById("filterCard");
    filterCard.classList.toggle("collapse");
    document.getElementById("toggleFilter").innerHTML = filterCard.classList.contains("collapse") ? "Show" : "Hide";
});



////////////////////////////////////////////////////////////
//Test code - DO NOT DELETE
let x = new Movie("Spiderman", 3, true);
let y = new Movie("Citizen Kane", 4, false);
let z = new Movie("Zootopia", 4.5, true);

allMovies.push(x,y,z);

/*replace console.log with display on web page*/
console.log("----------------");
console.log("running program......");
console.log("----------------");
printMovies();


let movie1 = new Movie("Parasite", 2, false);

/*replace console.log with display on web page*/
console.log("----------------");
addMovie(movie1);
console.log("----------------");



changeWatched("Spiderman");
/*replace console.log with display on web page*/
console.log("----------------");

printMovies();

/*replace console.log with display on web page*/
console.log("----------------");

changeWatched("Spiderman");
/*replace console.log with display on web page*/
console.log("----------------");

printMovies();
/*replace console.log with display on web page*/
console.log("----------------");

highRatings(3.5);
document.getElementById("ratingFilter").value = 3.5;