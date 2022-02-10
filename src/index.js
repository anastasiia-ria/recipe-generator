import $ from "jquery";
import "./css/styles.css";
import Recipe from "./js/recipe.js";

function attachListeners() {
  $("#recipe-list").on("click", "li", function () {
    $("#recipes > ul").hide();
    $(`#recipes > ul.${this.id}`).show();
  });
}

$(document).ready(function () {
  attachListeners();
  let idArray = [];
  //Add checked class to checked items on click
  $("input").click(function () {
    $("input:not(:checked)").parent().removeClass("checked");
    $("input:checked").parent().addClass("checked");
  });

  function getListElements(response) {
    if (response) {
      const meals = response.meals;

      for (let i = 0; i < meals.length; i++) {
        const recipeName = meals[i].strMeal;
        const id = meals[i].idMeal;
        $("ul#recipe-list").append(`<li id=${id}>${recipeName}</li>`);
        idArray.push(id);
      }
    } else {
      $(".showErrors").text(`There was an error: ${response}`);
    }
  }

  function getRecipeElements(response) {
    if (response) {
      const id = response.meals[0].idMeal;
      const name = response.meals[0].strMeal;
      const instructions = response.meals[0].strInstructions;
      $("#recipes").append(`<ul class=${id}></ul>`);
      $(`ul.${id}`).append(`<li>${name}</li>`);
      $(`ul.${id}`).append(`<li>${instructions}</li>`);
    } else {
      $(".showErrors").text(`There was an error: ${response}`);
    }
  }

  async function makeApiCall(ingredient) {
    const idResponse = await Recipe.getId(ingredient);
    getListElements(idResponse);

    for (let i = 0; i < idArray.length; i++) {
      const recipeResponse = await Recipe.getRecipe(idArray[i]);
      getRecipeElements(recipeResponse);
    }
  }

  $("#get-recipe").click(function () {
    const ingredient = $('input[name="main-ingredient"]:checked').val();
    $("#recipe-list").empty();
    $("#recipes").empty();
    makeApiCall(ingredient);
  });
});
