// NPM imports
import express from "express"
import axios from "axios"
import bodyParser from "body-parser"


// Initialzing variables
const app = express();
const port = 3000;

// Enabling Middleware and Making static files accesible to EJS files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Web Home Page (root)
app.get("/", async (req,res)=>{
    try {
        //Using axios to pull data from The MealDB API
        const result = await axios.get("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
        //This send the data from the API to the index.ejs then displays the index.ejs file on the browser
        res.render("index.ejs",{
            category_list: result.data.meals
        })

    // Handle errors that may occur during the API call or rendering process
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).send("An error occurred while fetching the recipe. Please try again later.");
    }
    
})  


// Handle POST requests to '/category-meals'. This route fetches meal data based on the meal category provided by the client.
app.post("/category-meals", async (req,res)=>{
    try {
        // Extracts 'meal-category' from the request body made by the user and fetches meal data from TheMealDB API based on the specified category
        const category = req.body["meal-category"]
        // 
        const result = await axios.get("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category)

        // Render the 'meals.ejs' view, passing the fetched meals and the category type
        res.render("meals.ejs",{
            meals: result.data.meals,
            mealType: category,
        })

    // Handle errors that may occur during the API call or rendering process
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).send("An error occurred while fetching the recipe. Please try again later.");
    }
})

// Handle POST requests to '/recipe'. This route fetches detailed recipe information for a specific meal by its ID.
app.post("/recipe", async (req,res)=>{
    try {
        // Extract the meal ID from the request body made by the user
        const mealID = req.body["meal-ID"]

        // Fetch detailed meal data from TheMealDB API using the meal ID
        const result = await axios.get("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID)
        const response = result.data.meals;

        // Prepare lists of ingredients and their respective measures
        const recipeIngredients = []
        const recipeMeasure = []
        for(var i = 1; i < 20 ; i++){
            recipeIngredients.push(response[0]["strIngredient" + i])  
            recipeMeasure.push(response[0]["strMeasure" + i]) 
       }

       // Render the 'recipe.ejs' view, passing all the necessary data for the recipe
        res.render("recipe.ejs",{
            ingredient: recipeIngredients,
            measure: recipeMeasure,
            mealName: response[0]["strMeal"],
            mealImage: response[0]["strMealThumb"],
            instruction: response[0]["strInstructions"],
            category: response[0]["strCategory"],
        }) 

    // Handle errors that may occur during the API call or rendering process
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).send("An error occurred while fetching the recipe. Please try again later.");
    }  
})


// Starts the server listening on the specified port for incoming connections
app.listen(port,()=>{

})
