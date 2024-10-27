// Function to register a user
async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();
    alert(data.message || "Registered successfully!");
  }
  
  // Function to log in a user
  async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful!"); // Notify user about successful login
      loadSlots(); // Load slots after successful login
    } else {
      alert(data.message || "Invalid login.");
    }
  }
  
  // Function to load available slots
  async function loadSlots() {
    const token = localStorage.getItem("token");
    const res = await fetch("/slots", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token for authenticated requests
      },
    });
  
    const slots = await res.json();
    
    const slotList = document.getElementById("slotList");
    slotList.innerHTML = ""; // Clear the list before adding slots
  
    slots.forEach((slot) => {
      const li = document.createElement("li");
      li.textContent = `${slot.time_range} (${slot.current_count}/5 booked)`;
  
      // Disable slot if it's fully booked
      if (slot.current_count >= slot.max_limit) {
        li.style.color = "gray";
        li.style.pointerEvents = "none"; // Make it unclickable
      } else {
        li.style.cursor = "pointer";
        li.onclick = () => bookSlot(slot.id); // Attach click event with slot ID
      }
  
      slotList.appendChild(li);
    });
  
    // Switch to slot view
    document.getElementById("auth").style.display = "none";
    document.getElementById("slots").style.display = "block";
  }
  
  // Function to book a slot
  async function bookSlot(slotId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to book a slot.");
      return;
    }
  
    const res = await fetch("/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ slotId }),
    });
  
    const data = await res.json();
    if (data.message) {
      alert(data.message);
      loadSlots(); // Reload slots after booking
    } else {
      alert("Error booking slot.");
    }
  }
  