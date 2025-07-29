/**
 * VirtualMenu class for creating a virtual scrolling menu.
 *
 * Imperative programming style:
 *  - bottom layer: state data and render()
 *  - middle layer: event handlers (handleSearch, handleScroll, selectItem)
 *  - top layer: bind the event handlers to the UI elements
 *
 * 不管是imperative还是declarative，都需要先搞清楚 state data 有哪些, 从data出发思考
 * 然后再去写render方法，最后再去绑定事件处理函数。
 */
class VirtualMenu {
  constructor() {
    this.items = [];
    this.filteredItems = [];
    this.itemHeight = 60;
    this.containerHeight = 400;
    this.visibleCount = Math.ceil(this.containerHeight / this.itemHeight) + 5;
    this.startIndex = 0;
    this.selectedIndex = -1;
    this.searchTerm = "";
    this.searchTimeout = null;

    this.container = document.getElementById("virtualList");
    this.searchInput = document.getElementById("searchInput");
    this.itemCountEl = document.getElementById("itemCount");
    this.renderTimeEl = document.getElementById("renderTime");

    this.init();
  }

  async init() {
    await this.generateItems();
    this.setupEventListeners();
    this.render(); //! see the render method is stateless, it relies on the current state
  }

  async generateItems() {
    const categories = [
      "Products",
      "Services",
      "Users",
      "Documents",
      "Projects",
      "Tasks",
      "Files",
      "Messages",
    ];
    const adjectives = [
      "Amazing",
      "Fantastic",
      "Incredible",
      "Outstanding",
      "Remarkable",
      "Excellent",
      "Perfect",
      "Brilliant",
    ];
    const nouns = [
      "Solution",
      "Framework",
      "System",
      "Platform",
      "Tool",
      "Service",
      "Product",
      "Experience",
    ];

    // Generate items in chunks to avoid blocking the UI
    const chunkSize = 10000;
    const totalItems = 1000000;

    for (let i = 0; i < totalItems; i += chunkSize) {
      const chunk = [];
      const endIndex = Math.min(i + chunkSize, totalItems);

      for (let j = i; j < endIndex; j++) {
        const category = categories[j % categories.length];
        const adjective =
          adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];

        chunk.push({
          id: j,
          name: `${adjective} ${noun} ${j + 1}`,
          description: `${category} item with ID ${j + 1}`,
          category: category,
          color: this.getColorForCategory(category),
          value: Math.floor(Math.random() * 1000) + 1,
        });
      }

      this.items.push(...chunk);

      // Update progress
      this.itemCountEl.textContent = `Generated ${this.items.length.toLocaleString()} items...`;

      // Yield control to prevent blocking
      if (i < totalItems - chunkSize) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      }
    }

    this.filteredItems = [...this.items];
    this.itemCountEl.textContent = `${this.items.length.toLocaleString()} total items`;
  }

  getColorForCategory(category) {
    const colors = {
      Products: "#ff6b6b",
      Services: "#4ecdc4",
      Users: "#45b7d1",
      Documents: "#96ceb4",
      Projects: "#feca57",
      Tasks: "#ff9ff3",
      Files: "#54a0ff",
      Messages: "#5f27cd",
    };
    return colors[category] || "#666";
  }

  setupEventListeners() {
    this.searchInput.addEventListener("input", (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 150);
    });

    this.container.addEventListener("scroll", () => {
      this.handleScroll();
    });

    this.container.addEventListener("click", (e) => {
      const item = e.target.closest(".menu-item");
      if (item) {
        const index = parseInt(item.dataset.index);
        this.selectItem(index);
      }
    });
  }

  /**
   *
   * @param {*} term
   * @returns {void}
   * action that triggers re-rendering of the virtual menu based on the search term.
   * It filters the items based on the search term, updates the filtered items,
   * and recalculates the render time.
   * If the search term is empty, it resets the filtered items to all items.
   * It also updates the item count and resets the scroll position to the top.
   */
  handleSearch(term) {
    const startTime = performance.now();
    this.searchTerm = term.toLowerCase();

    if (this.searchTerm === "") {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm) ||
          item.description.toLowerCase().includes(this.searchTerm) ||
          item.category.toLowerCase().includes(this.searchTerm),
      );
    }

    const endTime = performance.now();
    this.renderTimeEl.textContent = `Search time: ${(
      endTime - startTime
    ).toFixed(1)}ms`;
    this.itemCountEl.textContent = `${this.filteredItems.length.toLocaleString()} of ${this.items.length.toLocaleString()} items`;

    this.startIndex = 0;
    this.container.scrollTop = 0;
    this.render(); //! see the render method is stateless, it relies on the current state
  }

  /**
   * @returns {void}
   * Handles the scroll event of the virtual menu container.
   * It calculates the new start index based on the scroll position,
   * and if it has changed, it updates the start index and re-renders the visible items.
   * This method ensures that only the visible items are rendered, improving performance
   * by avoiding unnecessary rendering of items that are not currently in view.
   */
  handleScroll() {
    const scrollTop = this.container.scrollTop;
    const newStartIndex = Math.floor(scrollTop / this.itemHeight);

    if (newStartIndex !== this.startIndex) {
      this.startIndex = newStartIndex;
      this.render(); //! see the render method is stateless, it relies on the current state
    }
  }

  selectItem(index) {
    this.selectedIndex = index;
    this.render(); //! see the render method is stateless, it relies on the current state

    const item = this.filteredItems[index];
    if (item) {
      console.log("Selected item:", item);
    }
  }

  /**
   *
   * @returns {void}
   * ! Renders the visible items in the virtual menu based on the current state of VirtualMenu
   * It calculates the total height of the items, determines which items to display based on the
   * current scroll position, and updates the container's inner HTML with the visible items.
   * It also measures the render time and updates the render time display.
   * If no items match the search term, it displays a "No items found" message.
   */
  render() {
    const startTime = performance.now();

    if (this.filteredItems.length === 0) {
      this.container.innerHTML = `
                        <div class="no-results">
                            No items found for "${this.searchTerm}"
                        </div>
                    `;
      return;
    }

    // firstly, get the data correct
    const totalHeight = this.filteredItems.length * this.itemHeight;
    const offsetY = this.startIndex * this.itemHeight;
    const endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.filteredItems.length,
    );

    const visibleItems = this.filteredItems.slice(this.startIndex, endIndex);

    // then, render DOM based on the data
    const itemsHTML = visibleItems
      .map((item, index) => {
        const actualIndex = this.startIndex + index;
        const isSelected = actualIndex === this.selectedIndex;

        return `
                        <div class="menu-item ${
                          isSelected ? "selected" : ""
                        }" data-index="${actualIndex}">
                            <div class="item-main">
                                <div class="item-icon" style="background-color: ${
                                  item.color
                                }">
                                    ${item.category.charAt(0)}
                                </div>
                                <div class="item-info">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-description">${
                                      item.description
                                    }</div>
                                </div>
                            </div>
                            <div class="item-meta">
                                #${item.id + 1}
                            </div>
                        </div>
                    `;
      })
      .join("");

    this.container.innerHTML = `
                    <div class="virtual-spacer" style="height: ${totalHeight}px;"></div>
                    <div class="virtual-content" style="transform: translateY(${offsetY}px);">
                        ${itemsHTML}
                    </div>
                `;

    const endTime = performance.now();
    this.renderTimeEl.textContent = `Render time: ${(
      endTime - startTime
    ).toFixed(1)}ms`;
  }
}

// Initialize the virtual menu
new VirtualMenu();
