import "core-js/stable";
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarkView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js ";
// if (module.hot) {
//   module.hot.accept();
// }
///////////////////////////////////////
("ea5631ba-f202-4954-ba4a-9e2fe27ceb0c");
const recipeContainer = document.querySelector(".recipe");

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner(recipeContainer);
    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    //rendering bookmars
    bookmarksView.update(model.state.bookmarks);
  } catch (error) {
    recipeView.renderError();
    console.log(error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2)  load search results
    await model.loadSearchResults(query);
    // 3) render results
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError(error);
    console.log(error);
  }
};

const controllPagination = function (pageToGoTo) {
  resultsView.render(model.getSearchResultsPage(pageToGoTo));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);
  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // update recipeView
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //Succes message
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    //change id in the url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //close form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

//subcriber publisher thing
const init = function () {
  bookmarksView.addHandlerlRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controllPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
