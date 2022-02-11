import $ from "jquery";
import "./css/styles.css";
import Recipe from "./js/recipe.js";

$(document).ready(function () {
  let idArray = [];
  attachListeners();
  makeApiCallRandom();

  function getListElements(response) {
    if (response) {
      const meals = response.meals;

      for (let i = 0; i < meals.length; i++) {
        const recipeName = meals[i].strMeal;
        const id = meals[i].idMeal;
        const imgCode = meals[i].strMealThumb;
        $("ul#recipe-list").append(`<li id=${id}><span class="recipe-name">${recipeName}</span><img class="list-img"src=${imgCode}></li>`);
        idArray.push(id);
      }
      $("ul#recipe-list").children(":first").addClass("checked");
    } else {
      console.log("error");
      $(".showErrors").text(`There was an error: ${response}`);
    }
  }

  function attachListeners() {
    $("#recipe-list").on("click", "li", function () {
      $("#recipes > ul").hide();
      $(`#recipes > ul.${this.id}`).show();
      $("#recipe-list > li").removeClass("checked");
      $(this).addClass("checked");
      $("html, body").animate({ scrollTop: 300 }, "slow");
    });

    $("#choices").on("click", "button", function () {
      let ingredient = this.id;
      $("#recipe-list").show();
      $("#recipe-list").empty();
      $("#recipes").empty();
      idArray = [];
      makeApiCall(ingredient);
    });
  }

  function getRecipeElements(response) {
    if (response) {
      const id = response.meals[0].idMeal;
      const name = response.meals[0].strMeal;
      const imgCode = response.meals[0].strMealThumb;
      let instructions = response.meals[0].strInstructions;
      instructions = instructions.replace(/[\r\n]{2,}/g, "<br/>&nbsp&nbsp&nbsp");
      $("#recipes").append(`<ul class=${id}></ul>`);
      $(`ul.${id}`).append(`<li class="name">${name}</li>`);
      $(`ul.${id}`).append(`<li class="recipe-img-li"><img class="recipe-img"src=${imgCode}></li>`);
      $(`ul.${id}`).append(`<li class="instructions">${instructions}</li>`);
      $(`ul.${id}`).append(`<li class="ingredients"><ul class="ingredients${id}"></ul><ul class="measure${id}"></ul></li>`);
      $(`ul.ingredients${id}`).append(`<li class="header">Ingredient</li>`);
      $(`ul.measure${id}`).append(`<li class="header">Measure</li>`);
      for (let i = 1; i <= 20; i++) {
        const ingredient = response.meals[0]["strIngredient" + i];
        const measure = response.meals[0]["strMeasure" + i];
        if (ingredient !== "" && measure !== "" && ingredient !== null && measure !== null) {
          $(`ul.ingredients${id}`).append(`<li>${ingredient}</li>`);
          $(`ul.measure${id}`).append(`<li>${measure}</li>`);
        }
      }
      $("#recipes > ul").hide();
      $("#recipes").children(":first").show();
    } else {
      $(".showErrors").text(`There was an error: ${response}`);
    }
  }
  async function makeApiCallRandom() {
    const recipeResponse = await Recipe.getRandom();
    getRecipeElements(recipeResponse);
  }

  async function makeApiCall(ingredient) {
    const idResponse = await Recipe.getId(ingredient);
    if (idResponse.meals !== null) {
      getListElements(idResponse);
      for (let i = 0; i < idArray.length; i++) {
        const recipeResponse = await Recipe.getRecipe(idArray[i]);
        getRecipeElements(recipeResponse);
      }
    } else {
      $(".showErrors").text(`Sorry, we could not find recipes with ${ingredient}`);
      setTimeout(function () {
        $(".showErrors").empty();
      }, 2000);
    }
  }

  $("#top").click(function () {
    $("html, body").animate({ scrollTop: 300 }, "slow");
  });

  $("#random").click(function () {
    $("#recipes").empty();
    makeApiCallRandom();
  });

  $("#search-icon").click(function () {
    const ingredient = $("input#search").val();
    $("input#search").val("");
    $("#recipe-list").show();
    $("#recipe-list").empty();
    $("#recipes").empty();
    idArray = [];
    makeApiCall(ingredient);
  });
});
