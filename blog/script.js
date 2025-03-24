// script.js

const defaultPosts = [
    {
      title: "Understanding Stoicism",
      image: "https://via.placeholder.com/400x250",
      excerpt: "Explore the teachings of Marcus Aurelius and Epictetus.",
      category: "Stoicism",
      tags: ["Stoicism", "Ancient"],
      date: "2024-12-01",
      link: "#"
    },
    {
      title: "Mindful Living in Modern Times",
      image: "https://via.placeholder.com/400x250",
      excerpt: "Practical ways to live mindfully in a digital age.",
      category: "Mindfulness",
      tags: ["Mindfulness", "Wellness"],
      date: "2024-12-18",
      link: "#"
    }
  ];
  
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const categoryFilters = document.getElementById("categoryFilters");
  const postContainer = document.getElementById("postContainer");
  function getAllPosts() {
    const customPosts = (JSON.parse(localStorage.getItem("customPosts")) || []).map((post, index) => ({
      ...post,
      fromLocalStorage: true,
      localIndex: index
    }));
    return [...defaultPosts, ...customPosts];
  }
  
  
  function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "All";
  }
  
  let activeCategory = getCategoryFromUrl();
  
  function renderCategoryButtons(posts) {
    const categories = ["All", ...new Set(posts.map(p => p.category))];
    categoryFilters.innerHTML = categories.map(cat => `
      <button data-category="${cat}" class="${cat === activeCategory ? 'active' : ''}">${cat}</button>
    `).join("");
  
    document.querySelectorAll(".category-filters button").forEach(button => {
      button.addEventListener("click", () => {
        const selectedCategory = button.dataset.category;
        window.location.href = `index.html?category=${encodeURIComponent(selectedCategory)}`;
      });
    });
  }
  
  function displayPosts(posts) {
    postContainer.innerHTML = "";
  
    if (posts.length === 0) {
      postContainer.innerHTML = "<p>No posts found.</p>";
      return;
    }
  
    posts.forEach((post, index) => {
      const postCard = document.createElement("article");
      postCard.classList.add("post-card");
  
      const postId = post.fromLocalStorage ? `custom-${post.localIndex}` : `default-${index}`;
      const tags = post.tags.map(tag => `<span>${tag}</span>`).join("");
  
      postCard.innerHTML = `
        <a href="post.html?id=${postId}">
          <img src="${post.image}" alt="${post.title}">
        </a>
        <div class="post-content">
          <h2><a href="post.html?id=${postId}">${post.title}</a></h2>
          <p class="post-date">${formatDate(post.date)}</p>
          <p>${post.excerpt}</p>
          <div class="post-tags">${tags}</div>
          ${post.fromLocalStorage ? `
            <button class="edit-btn" data-index="${post.localIndex}">✏️ Edit</button>
            <button class="delete-btn" data-index="${post.localIndex}">🗑️ Delete</button>
          ` : ''}
          
        </div>
      `;
  
      postContainer.appendChild(postCard);
    });
  
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        deleteCustomPost(index);
      });
    });
  }
  
  
  
  function filterAndDisplay() {
    const allPosts = getAllPosts();
    const searchTerm = searchInput?.value.toLowerCase() || "";
    const sortValue = sortSelect?.value || "newest";
  
    let filtered = [...allPosts];
  
    if (activeCategory !== "All") {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
  
    if (searchTerm) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm));
    }
  
    filtered.sort((a, b) => {
      const dA = new Date(a.date), dB = new Date(b.date);
      return sortValue === "newest" ? dB - dA : dA - dB;
    });
  
    renderCategoryButtons(allPosts);
    displayPosts(filtered);
  }
  
  searchInput?.addEventListener("input", filterAndDisplay);
  sortSelect?.addEventListener("change", filterAndDisplay);
  
  filterAndDisplay();
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  function deleteCustomPost(index) {
    const customPosts = JSON.parse(localStorage.getItem("customPosts")) || [];
    customPosts.splice(index, 1); // remove one item at that index
    localStorage.setItem("customPosts", JSON.stringify(customPosts));
    filterAndDisplay(); // reload posts
  }
  
  
  