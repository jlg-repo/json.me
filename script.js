// script.js: makes the personal page interactive
// Loaded with defer, so the HTML is already on the page when this runs

//light / dark mode toggle

const themeToggleButton = document.querySelector("#theme-toggle");

// dark by default, the .light class in styles.css swaps in the light palette
themeToggleButton.addEventListener("click", function () {
  // toggle() adds the class if missing, removes if present, and returns true when added
  const isLightMode = document.body.classList.toggle("light");

  // The button names the mode it will switch to
  themeToggleButton.textContent = isLightMode ? "Dark mode" : "Light mode";
});

// Guestbook form

// Page elements the form code reads from or writes to
const messageForm = document.querySelector("#message-form");
const senderNameInput = document.querySelector("#sender-name");
const senderMessageInput = document.querySelector("#sender-message");
const formError = document.querySelector("#form-error");
const formSummary = document.querySelector("#form-summary");

// Runs when the visitor clicks Send or presses Enter in a field
messageForm.addEventListener("submit", function (event) {
  // Stop the browser from reloading the page so the result can be shown
  event.preventDefault();

  // trim() removes spaces so a name of only spaces counts as empty
  const senderName = senderNameInput.value.trim();
  const senderMessage = senderMessageInput.value.trim();

  // Find first problem, if any, and field it belongs to
  let errorText = "";
  let invalidField = null;
  if (senderName === "") {
    errorText = "Please enter your name.";
    invalidField = senderNameInput;
  } else if (senderMessage === "") {
    errorText = "Please write a message.";
    invalidField = senderMessageInput;
  }

  // Tell screen readers which field is wrong (and clear it once fixed)
  senderNameInput.setAttribute("aria-invalid", invalidField === senderNameInput);
  senderMessageInput.setAttribute("aria-invalid", invalidField === senderMessageInput);

  if (invalidField) {
    // Invalid: show the error, hide any old summary, and move to the field to fix
    formError.textContent = errorText;
    formSummary.textContent = "";
    invalidField.focus();
    return;
  }

  // Valid: clear the error, show what was sent, and empty the form
  formError.textContent = "";
  formSummary.textContent = `Thanks, ${senderName}! Your message was signed into the guestbook: "${senderMessage}"`;
  messageForm.reset();
});

// Filterable blog topic list
// Search box + "Showing X of Y" count, category filter buttons

// The topics I write about, taken from the Blog section's description
// Each category matches a filter button's data-category in index.html
const blogTopics = [
  { name: "Machine Learning", category: "AI" },
  { name: "NLP", category: "AI" },
  { name: "RAG", category: "AI" },
  { name: "Agents", category: "AI" },
  { name: "Anomaly Detection", category: "AI" },
  { name: "Omarchy", category: "Operating Systems" },
  { name: "MacOSX", category: "Operating Systems" },
  { name: "Human-Centered Computing", category: "Computing" },
  { name: "System Architecture", category: "Computing" },
  { name: "Economics", category: "Economics" },
];

// list state
const topicState = {
  searchText: "",     // what the visitor has typed in the search box
  category: "All",    // which filter button is selected
};

// Page elements the list code reads from/ writes to
const topicList = document.querySelector("#topic-list");
const topicCount = document.querySelector("#topic-count");
const topicSearch = document.querySelector("#topic-search");
const categoryButtons = document.querySelectorAll("#category-filters button");

// Builds the list on the page from topicState
function render() {
  const searchText = topicState.searchText.trim().toLowerCase();

  // Keep a topic only if it is in the selected category and matches the search
  const visibleTopics = blogTopics.filter(function (topic) {
    const inCategory = topicState.category === "All" || topic.category === topicState.category;
    const matchesSearch =
      topic.name.toLowerCase().includes(searchText) ||
      topic.category.toLowerCase().includes(searchText);
    return inCategory && matchesSearch;
  });

  // Remove the old items before adding the new ones
  topicList.replaceChildren();

  // One <li> per topic, the name, then a small category tag
  visibleTopics.forEach(function (topic) {
    const listItem = document.createElement("li");
    listItem.textContent = topic.name;

    const categoryTag = document.createElement("span");
    categoryTag.className = "topic-tag";
    categoryTag.textContent = topic.category;

    listItem.append(categoryTag);
    topicList.append(listItem);
  });

  // Show how many topics are visible out of the total
  topicCount.textContent = `Showing ${visibleTopics.length} of ${blogTopics.length}`;

  // Mark the selected filter button as pressed (the CSS lights it up)
  categoryButtons.forEach(function (button) {
    const isSelected = button.dataset.category === topicState.category;
    button.setAttribute("aria-pressed", isSelected);
  });
}

// Filter as the visitor types
topicSearch.addEventListener("input", function () {
  topicState.searchText = topicSearch.value;
  render();
});

// filter by category when a button is clicked (additional feature)
categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    topicState.category = button.dataset.category;
    render();
  });
});

// Draw the full list when the page first loads
render();
