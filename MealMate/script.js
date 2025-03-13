// firebase-config.js must be loaded before this file
// Assuming Firebase is initialized in firebase-config.js

let recipeGroceryLists = {}; // { recipeName: [ingredient, ...] }
let calendarRecipes = [];  // { day, id, name, image, instructions }
let pendingRecipe = null;  // For day selection modal

const db = firebase.firestore();

// Show selected tab
function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(div => {
    div.style.display = 'none';
  });
  document.getElementById(tab).style.display = 'block';
}

// Suggest recipes
function suggestRecipes() {
  const ingredients = document.getElementById("ingredientInput").value.toLowerCase().split(',');
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "Loading...";
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients.join(',')}`)
    .then(res => res.json())
    .then(data => {
      recipeList.innerHTML = "";
      if (data.meals) {
        data.meals.forEach(meal => {
          const li = document.createElement("li");
          li.classList.add("meal-item");
          li.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h4>${meal.strMeal}</h4>
            <div class="action-buttons">
              <button onclick="viewFullRecipe(${meal.idMeal})">View Full Recipe</button>
              <button onclick="addToGrocery('${meal.strMeal}')">Add Ingredients</button>
              <button onclick="addRecipeToCalendar(${meal.idMeal}, '${meal.strMeal}')">Add to Calendar</button>
            </div>`;
          recipeList.appendChild(li);
        });
      } else {
        recipeList.innerHTML = "No meals found.";
      }
    });
}

// View Full Recipe
function viewFullRecipe(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
      if (data.meals) {
        const meal = data.meals[0];
        document.getElementById("modalTitle").textContent = meal.strMeal;
        document.getElementById("modalImage").src = meal.strMealThumb;
        document.getElementById("modalInstructions").textContent = meal.strInstructions;
        document.getElementById("recipeModal").style.display = "flex";
      }
    });
}

function closeModal() {
  document.getElementById("recipeModal").style.display = "none";
}

// Add to Grocery List
function addToGrocery(mealName) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then(res => res.json())
    .then(data => {
      if (data.meals) {
        const meal = data.meals[0];
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          if (ing && ing.trim() !== '') ingredients.push(ing.trim());
        }
        recipeGroceryLists[mealName] = ingredients;
        generateGroceryList();
        saveGroceryListsToFirestore();
        showToast(`Grocery list updated for "${mealName}".`);
      }
    });
}

function displayGroceryList() {
    const groceryListContainer = document.getElementById("groceryListContainer");
    groceryListContainer.innerHTML = ""; // clear previous list
    if (user) {
      const groceryListsRef = collection(db, "users", user.uid, "recipeGroceryLists");
      getDocs(groceryListsRef).then((querySnapshot) => {
        if (querySnapshot.empty) {
          groceryListContainer.innerHTML = "<p>No grocery lists found.</p>";
          return;
        }
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Loading grocery list:", data); // for debugging
  
          // Create a container for each grocery list
          const listWrapper = document.createElement("div");
          listWrapper.innerHTML = `
            <h4>${data.recipeName}</h4>
            <ul>${data.ingredients.map(item => `<li>${item}</li>`).join("")}</ul>
          `;
          groceryListContainer.appendChild(listWrapper);
        });
      }).catch((error) => {
        console.error("Error retrieving grocery list:", error);
        groceryListContainer.innerHTML = "<p>Error loading grocery list.</p>";
      });
    } else {
      groceryListContainer.innerHTML = "<p>Please log in to view your grocery list.</p>";
    }
  }
  
  
  

  function generateGroceryList() {
    const container = document.getElementById("groceryListContainer");
    container.innerHTML = "";
  
    if (Object.keys(recipeGroceryLists).length === 0) {
      container.innerHTML = "<p>No grocery lists available.</p>";
      return;
    }
  
    for (const recipe in recipeGroceryLists) {
      const card = document.createElement("div");
      card.classList.add("grocery-list-box");
  
      const title = document.createElement("h3");
      title.textContent = recipe;
  
      const ul = document.createElement("ul");
      recipeGroceryLists[recipe].forEach(ingredient => {
        const li = document.createElement("li");
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
  
        const span = document.createElement("span");
        span.className = "grocery-item-text";
        span.textContent = ingredient;
  
        checkbox.addEventListener("change", () => {
          span.classList.toggle("checked", checkbox.checked);
        });
  
        li.appendChild(checkbox);
        li.appendChild(span);
        ul.appendChild(li);
      });
  
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove Recipe";
      removeBtn.onclick = () => {
        removeGroceryList(recipe);
      };
  
      card.appendChild(title);
      card.appendChild(ul);
      card.appendChild(removeBtn);
  
      container.appendChild(card);
    }
  }
  

function removeGroceryList(recipeName) {
  delete recipeGroceryLists[recipeName];
  generateGroceryList();
  saveGroceryListsToFirestore();
  showToast(`Removed grocery list for "${recipeName}".`);
}

function addRecipeToCalendar(id, name) {
  pendingRecipe = { id, name };
  document.getElementById("dayModal").style.display = "flex";
}

function closeDayModal() {
  document.getElementById("dayModal").style.display = "none";
  pendingRecipe = null;
}

function selectDay(day) {
    if (!pendingRecipe) return;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${pendingRecipe.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          const meal = data.meals[0];
          calendarRecipes.push({
            day,
            id: pendingRecipe.id,
            name: pendingRecipe.name,
            image: meal.strMealThumb,
            instructions: meal.strInstructions
          });
          renderCalendarRecipes();
          saveCalendarRecipesToFirestore(); // <- Save it here
          showToast(`Added ${pendingRecipe.name} to ${day}.`);
          closeDayModal();
        }
      });
  }
  

function renderCalendarRecipes() {
  const container = document.getElementById("weeklyCalendar");
  container.innerHTML = "";
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  days.forEach(day => {
    const col = document.createElement("div");
    col.className = "calendar-column";
    const header = document.createElement("h3");
    header.textContent = day;
    col.appendChild(header);
    const dayRecipes = calendarRecipes.filter(r => r.day === day);
    if (dayRecipes.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No recipes";
      col.appendChild(p);
    } else {
      dayRecipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "calendar-card";
        card.innerHTML = `
          <h4>${recipe.name}</h4>
          <img src="${recipe.image}" alt="${recipe.name}" />
          <div class="action-buttons">
            <button onclick="viewFullRecipe(${recipe.id})">View Full Recipe</button>
            <button onclick="addToGrocery('${recipe.name}')">Add Ingredients</button>
            <button onclick="removeFromCalendar(${recipe.id})">Remove</button>
          </div>`;
        col.appendChild(card);
      });
    }
    container.appendChild(col);
  });
}

function saveCalendarRecipesToFirestore() {
    const user = firebase.auth().currentUser;
    if (user) {
      db.collection("calendarRecipes").doc(user.uid).set({
        recipes: calendarRecipes
      })
      .then(() => {
        console.log("Calendar recipes saved to Firestore.");
      })
      .catch((error) => {
        console.error("Error saving calendar recipes:", error);
      });
    }
  }

function removeFromCalendar(id) {
  calendarRecipes = calendarRecipes.filter(r => r.id !== id);
  renderCalendarRecipes();
  showToast("Recipe removed from calendar.");
}

function saveGroceryListsToFirestore() {
  const user = firebase.auth().currentUser;
  if (user) {
    db.collection("groceryLists").doc(user.uid).set({ lists: recipeGroceryLists });
  }
}

function loadCalendarRecipesFromFirestore() {
    const user = firebase.auth().currentUser;
    if (user) {
      db.collection("calendarRecipes").doc(user.uid).get()
        .then((doc) => {
          if (doc.exists && doc.data().recipes) {
            calendarRecipes = doc.data().recipes;
            renderCalendarRecipes();
          }
        })
        .catch((error) => {
          console.error("Error loading calendar recipes:", error);
        });
    }
  }
  

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.getElementById("user-info").textContent = `Logged in as: ${user.email}`;
    db.collection("calendarRecipes").doc(user.uid).get().then(doc => {
      if (doc.exists) {
        calendarRecipes = doc.data().recipes || [];
        renderCalendarRecipes();
      }
    });
    db.collection("groceryLists").doc(user.uid).get().then(doc => {
      if (doc.exists) {
        recipeGroceryLists = doc.data().lists || {};
        generateGroceryList();
      }
    });
  } else {
    window.location.href = "login.html";
  }
});

function logout() {
  firebase.auth().signOut().then(() => location.href = "login.html");
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => toast.className = toast.className.replace("show", ""), 3000);
}
