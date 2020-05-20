// When the user presses the enter button we will run the function to get recipes
$(document).on('keypress',function(event) {
    if(event.which == 13 && event.target.id === 'recipeSearch') {
        $('#recipeSearch').attr('disabled', true);
        event.preventDefault();
        let inputValue = event.target.value;
        getRecipeList(inputValue);
    }

});

// when then user clicks the search button the app will run the function to find recipes
$('#recipeSearchButton').on('click',function(event) {
    $('#recipeSearchButton').prop('disabled', true);
    event.preventDefault();
    let inputValue = $('#recipeSearch')[0].value;
    
    if (!inputValue) {
        showError(false);
    } else {
        getRecipeList(inputValue);
    }
    

});

//function to populate the array of recipes
function getRecipeList (searchName){
    const edamamURL = `https://api.edamam.com/search?q=${searchName}&app_id=77499a47&app_key=7f81ddd0b166a41e9d7c964bb2117d02&from=0&to=10&calories=591-722&health=alcohol-free`;
    $('.Recipes').empty();  
    // $('body').css('background-image', 'url("")');  
    $.ajax({
        url: edamamURL,
        method: 'GET'
    }).then(function(response){
        
        if (!response || response.hits.length === 0) {
            showError(false);
        } else {
            response.hits.map((i, index) => {
                let div = $('<div>').attr('class', 'row border-bottom recipe bg-white mb-2 py-2').attr('data-nutrients', JSON.stringify(i));
                let div2 = $('<div>').attr('class', 'col-md-4 col-sm-4 m-auto');
                let foodImg = $('<img>').attr('src', i.recipe.image);
                let foodName = $('<div>').attr('class', 'col-md-4 col-sm-4 m-auto').text(i.recipe.label);
                let calorieNutrients = $('<div>').attr('class', 'col-md-4 col-sm-4 m-auto').text('Calories: ' + Math.round(i.recipe.calories));       
                div2.append(foodImg);
                div.append(div2, foodName, calorieNutrients);
                $('.Recipes').append(div);
                $('#recipeSearchButton').prop('disabled', false);
                $('#recipeSearch').attr('disabled', false);
            })
        }
    
    }).catch((err) => {
        console.log(err);
        showError(true);
    })
}

function showError(isAPIError) {
    $('#recipeSearchButton').prop('disabled', false);
    $('#recipeSearch').attr('disabled', false);
    $.ajax({
        method: 'GET',
        url: 'https://api.spoonacular.com/food/jokes/random?apiKey=03bbe11b8f5b4c9e91360249bbc5613b'
    }).then((joke) => {
        var text = isAPIError ?
            'Something went wrong,' :
            'No items match your search,';
        $('.modal-body').html(`${text} please try again and enjoy this funny food joke: <br><br>${joke.text}`)
        $('#modal').modal();
    })
}

$(document).on('click', '.recipe', function() {
    $('#ingredients').empty();
    $('#nutrients').empty();
    let data = $(this).attr('data-nutrients');
    let recipe = JSON.parse(data);
    let inputValue = $('#recipeSearch')[0].value;
    let healthLabel = ''; 
    let cautions = '';
    let foodWords = ['tasty', 'succulent', 'delicious', 'scrumptious', 'divine', 'flavorful', 'mouthwatering', 'yummy']
    let thisWord = foodWords[Math.floor(Math.random() * foodWords.length)];

    recipe.recipe.healthLabels.map((h, i) => {
        healthLabel += h;
        
        if (i != recipe.recipe.healthLabels.length - 1) {
            healthLabel += ', ';
        } else {
            healthLabel += ' ';
        }
        
    })

    recipe.recipe.cautions.map((c, i) => {
        cautions += c;
        
        if (i != recipe.recipe.cautions.length - 1) {
            cautions += ', ';
        } else {
            healthLabel += ' ';
        }
        
    })

    console.log(JSON.parse(data));
    $('#recipe-img').attr('src', recipe.recipe.image).attr('alt', recipe.recipe.label);
    $('#recipe-name').text(recipe.recipe.label);
    $('#recipe-description').html('This ' + thisWord + ' ' + inputValue + ' recipe is brought to you by ' + recipe.recipe.source + '.' + 
        '<br>Health Labels: ' + healthLabel + '<br> Cautions: ' + cautions + '<br> Yields: ' + recipe.recipe.yield + ' Servings');

    // This is the ingredients   
    let ingredientsDiv = $('#ingredients');
    recipe.recipe.ingredientLines.map(i => {
        let li = $('<li>').attr('class', 'list-group-item').text(i);
        ingredientsDiv.append(li);
    })

    // nutrients area
    let nutrientsId = $('#nutrients');
    let nutrientHeader = $('<div>').attr('class', 'row border nutrient-header');
    let labelHeader = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4 font-weight-bold').text('Nutrient');
    let totalHeader = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4 font-weight-bold').text('Total');
    let dailyHeader = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4 font-weight-bold').text('Daily Total');
    nutrientHeader.append(labelHeader, totalHeader, dailyHeader);
    nutrientsId.append(nutrientHeader);

    recipe.recipe.digest.map(nutrient => {
        let div = $('<div>').attr('class', 'row border');
        let label = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4').text(nutrient.label);
        let total = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4').text(Math.round(nutrient.total) + nutrient.unit);
        let daily = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4').text(Math.round(nutrient.daily) + nutrient.unit);
        div.append(label, total, daily);
        nutrientsId.append(div);
    })
})
