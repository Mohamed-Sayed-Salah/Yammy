const loadingScreen = $(".inner-loading-screen");
const data = $("#data");

const searchContainer = $("#searchContainer");
function closeNav() {
  let width = $("#leftMenu nav").outerWidth();
  $("#leftMenu").animate({ left: -width }, 500);

  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");

  $("nav li").animate(
    {
      top: 300
    },
    500
  );
}

function openNav() {
  $("#leftMenu").animate({ left: 0 }, 500);
  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");

  for (let i = 0; i < 5; i++) {
    $("nav li")
      .eq(i)
      .animate(
        {
          top: 0
        },
        (i + 5) * 100
      );
  }
}

function showLoadingScreen() {
  loadingScreen.fadeIn(300).css("display", "flex");
}

function hideLoadingScreen() {
  loadingScreen.fadeOut(300);
}

$("#closeNav").click(e => {
  if ($("#leftMenu").css("left") == "0px") {
    closeNav();
  } else {
    openNav();
  }
});

$(document).ready(() => {
  searchByName("");
});

function displayMeals(meals) {
  let mealHtml = "";
  for (let i = 0; i < meals.length; i++) {
    mealHtml += `
    <div class="col-md-3">
    <div onclick="getMealsDetails(${meals[i].idMeal});" class="overflow-hidden rounded-2 position-relative item cursor-pointer">
      <img
        src=${meals[i].strMealThumb}
        alt=""
        class="w-100"
      />
      <div
        class="img-layer w-100 h-100 position-absolute  bg-white bg-opacity-75 p-2 text-black d-flex align-items-center"
      >
        <h3>${meals[i].strMeal}</h3>
      </div>
    </div>
    </div>
    `;
  }

  data.html(mealHtml);
}

function displayMealsDetails(meal) {
  searchContainer.html("");
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",") || [];
  let tagsHtml = "";
  for (let i = 0; i < tags.length; i++) {
    tagsHtml += `
    <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
    `;
  }

  let mealHtml = `
<div class="col-md-4">
<img class="w-100 rounded-3" src="${meal.strMealThumb}"
    alt="">
    <h2>${meal.strMeal}</h2>
</div>
<div class="col-md-8">
<h2>Instructions</h2>
<p>${meal.strInstructions}</p>
<h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
<h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
<h3>Recipes :</h3>
<ul class="list-unstyled d-flex g-3 flex-wrap">
    ${ingredients}
</ul>

<h3>Tags :</h3>
<ul class="list-unstyled d-flex g-3 flex-wrap">
    ${tagsHtml}
</ul>

<a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
<a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
</div>
`;

  data.html(mealHtml);
}

async function getMealsDetails(id) {
  showLoadingScreen();

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await response.json();
  displayMealsDetails(data.meals[0]);
  hideLoadingScreen();
}

function displayAreas(areas) {
  let areaHtml = "";
  for (let i = 0; i < areas.length; i++) {
    areaHtml += `
    <div class="col-md-3">
    <div onclick="getAreaMeals('${areas[i].strArea}');" class="rounded-2 text-center cursor-pointer">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3>${areas[i].strArea}</h3>
    </div>
</div>
    `;
  }
  data.html(areaHtml);
}
async function getAreas() {
  searchContainer.html("");
  showLoadingScreen();

  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  response = await response.json();
  displayAreas(response.meals);
  hideLoadingScreen();
}
async function getAreaMeals(area) {
  showLoadingScreen();

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  hideLoadingScreen();
}

function displayIngredients(ingredients) {
  let ingredientHtml = "";
  for (let i = 0; i < ingredients.length; i++) {
    ingredientHtml += `
<div class="col-md-3">
  <div onclick="getIngredientMeals('${
    ingredients[i].strIngredient
  }');" class="rounded-2 text-center cursor-pointer">
    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
    <h3>${ingredients[i].strIngredient}</h3>
    <p>${ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}}</p>
  </div>
</div>`;
  }
  data.html(ingredientHtml);
}

async function getIngredients() {
  searchContainer.html("");
  showLoadingScreen();

  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  response = await response.json();
  displayIngredients(response.meals.slice(0, 20));
  hideLoadingScreen();
}

async function getIngredientMeals(ingredient) {
  showLoadingScreen();

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  hideLoadingScreen();
}

function displayCategories(categories) {
  let categoriesHtml = "";
  for (let i = 0; i < categories.length; i++) {
    categoriesHtml += `
    <div class="col-md-3">
<div onclick="getCategoryMeals('${
      categories[i].strCategory
    }');" class="overflow-hidden rounded-2 position-relative item cursor-pointer">
  <img
    src=${categories[i].strCategoryThumb}
    alt=""
    class="w-100"
  />
  <div
    class="img-layer w-100 h-100 position-absolute bg-white bg-opacity-75 p-2 text-black text-center"
  >
    <h3>${categories[i].strCategory}</h3>
    <p>${categories[i].strCategoryDescription
      .split(" ")
      .slice(0, 20)
      .join(" ")}}</p>
  </div>
</div>
</div>
    `;
  }
  data.html(categoriesHtml);
}

async function getCategories() {
  searchContainer.html("");
  showLoadingScreen();

  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  response = await response.json();
  displayCategories(response.categories);
  hideLoadingScreen();
}

async function getCategoryMeals(category) {
  showLoadingScreen();

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  hideLoadingScreen();
}

async function searchByName(term) {
  showLoadingScreen();

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();

  if (response.meals) {
    displayMeals(response.meals);
  } else {
    displayMeals([]);
  }

  hideLoadingScreen();
}
async function searchByFirstLetter(letter) {
  showLoadingScreen();
  if (!letter) {
    letter = "a";
  }
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  response = await response.json();

  if (response.meals) {
    displayMeals(response.meals);
  } else {
    displayMeals([]);
  }

  hideLoadingScreen();
}

function showSearchInputs() {
  searchContainer.html(`
  <div class="row py-4">
  <div class="col-md-6">
    <input
    onkeyup="searchByName(this.value)"
      class="form-control bg-transparent text-white"
      type="text"
      placeholder="Search By Name"
    />
  </div>
  <div class="col-md-6">
    <input
    onkeyup="searchByFirstLetter(this.value)"
      maxlength="1"
      class="form-control bg-transparent text-white"
      type="text"
      placeholder="Search By First Letter"
    />
  </div>
</div>
  `);
  data.html("");
}

function showContactsAndAddEvents() {
  searchContainer.html("");
  data.html(`
  <div
  class="contact min-vh-100 d-flex justify-content-center align-items-center"
>
  <div class="container w-75 text-center">
    <div class="row g-4">
      <div class="col-md-6">
        <input
          id="nameInput"
          type="text"
          class="form-control"
          placeholder="Enter Your Name"
        />
        <div
          id="nameAlert"
          class="alert alert-danger w-100 mt-2 d-none"
        >
          Special characters and numbers not allowed
        </div>
      </div>
      <div class="col-md-6">
        <input
          id="emailInput"
          type="email"
          class="form-control"
          placeholder="Enter Your Email"
        />
        <div
          id="emailAlert"
          class="alert alert-danger w-100 mt-2 d-none"
        >
          Email not valid *exemple@yyy.zzz
        </div>
      </div>
      <div class="col-md-6">
        <input
          id="phoneInput"
          type="text"
          class="form-control"
          placeholder="Enter Your Phone"
        />
        <div
          id="phoneAlert"
          class="alert alert-danger w-100 mt-2 d-none"
        >
          Enter valid Phone Number
        </div>
      </div>
      <div class="col-md-6">
        <input
          id="ageInput"
          type="number"
          class="form-control"
          placeholder="Enter Your Age"
        />
        <div
          id="ageAlert"
          class="alert alert-danger w-100 mt-2 d-none"
        >
          Enter valid age
        </div>
      </div>
      <div class="col-md-6">
        <input
          id="passwordInput"
          type="password"
          class="form-control"
          placeholder="Enter Your Password"
        />
        <div
          id="passwordAlert"
          class="alert alert-danger w-100 mt-2 d-none"
        >
          Enter valid password *Minimum eight characters, at least one
          letter and one number:*
        </div>
      </div>
      <div class="col-md-6">
        <input
          id="repasswordInput"
          type="password"
          class="form-control"
          placeholder="Repassword"
        />
        <div
          id="repasswordAlert"
          class="alert alert-danger w-100 mt-2 d-none"
        >
          Enter valid repassword
        </div>
      </div>
    </div>
    <button
      id="submitBtn"
      disabled
      class="btn btn-outline-danger px-2 mt-3"
    >
      Submit
    </button>
  </div>
</div>
  `);

  $("#nameInput").on("keyup", function () {
    if (nameValidation()) {
      $("#nameAlert").addClass("d-none");
    } else {
      $("#nameAlert").removeClass("d-none");
    }
    InputsValidation();
  });

  $("#emailInput").on("keyup", function () {
    if (emailValidation()) {
      $("#emailAlert").addClass("d-none");
    } else {
      $("#emailAlert").removeClass("d-none");
    }
    InputsValidation();
  });

  $("#phoneInput").on("keyup", function () {
    if (phoneValidation()) {
      $("#phoneAlert").addClass("d-none");
    } else {
      $("#phoneAlert").removeClass("d-none");
    }
    InputsValidation();
  });

  $("#ageInput").on("keyup", function () {
    if (ageValidation()) {
      $("#ageAlert").addClass("d-none");
    } else {
      $("#ageAlert").removeClass("d-none");
    }
    InputsValidation();
  });

  $("#passwordInput").on("keyup", function () {
    if (passwordValidation()) {
      $("#passwordAlert").addClass("d-none");
    } else {
      $("#passwordAlert").removeClass("d-none");
    }
    InputsValidation();
  });

  $("#repasswordInput").on("keyup", function () {
    if (repasswordValidation()) {
      $("#repasswordAlert").addClass("d-none");
    } else {
      $("#repasswordAlert").removeClass("d-none");
    }
    InputsValidation();
  });
}

function InputsValidation() {
  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    $("#submitBtn").removeAttr("disabled");
  } else {
    $("#submitBtn").attr("disabled", "true");
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phoneInput").value
  );
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("ageInput").value
  );
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
