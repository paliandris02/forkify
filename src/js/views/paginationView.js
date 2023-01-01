import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;

      const pageToGoTo = +btn.dataset.goto;
      handler(pageToGoTo);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `${this._generateMarkupButton("right", currPage)}`;
    }
    // Last page
    if (currPage === numPages && numPages > 1) {
      return `${this._generateMarkupButton("left", currPage)}`;
    }
    // Other page
    if (currPage < numPages) {
      return `${
        this._generateMarkupButton("left", currPage) +
        this._generateMarkupButton("rigth", currPage)
      }`;
    }
    // Page 1, and there are NO other pages
    return "";
  }
  _generateMarkupButton(direction, currPage) {
    let pageToGoTo = direction === "left" ? currPage - 1 : currPage + 1;
    let markup = `<button data-goto="${pageToGoTo}" class="btn--inline pagination__btn--${
      direction === "left" ? "prev" : "next"
    }">
    <svg class="search__icon">
     <use href="${icons}#icon-arrow-${direction}"></use>
    </svg>
    <span>Page ${pageToGoTo}</span>
 </button>`;
    return markup;
  }
}

export default new PaginationView();
