# 🎡 Spin & Group Fun!

A fun, colorful, interactive web application that lets you spin a wheel to pick random names or randomly assign people into groups. Perfect for classrooms, team-building activities, games, and social events!

![Emoji](https://img.shields.io/badge/Status-Active-brightgreen)
![Language](https://img.shields.io/badge/Language-HTML%20%2F%20CSS%20%2F%20JS-blue)

---

## ✨ Features

- **🎡 Wheel Mode** – Spin the wheel to select a random name from your list.
- **👥 Make Groups Mode** – Spin once to pick a person, then spin again to assign them to a random group.
- **➕ Add / ✏️ Edit / 🗑️ Clear** names, people, and groups with easy-to-use modals.
- **📝 Grouping Results History** – View all assignments with timestamps.
- **📤 Export CSV** – Download your grouping results as a CSV file.
- **🎉 Celebrations** – Confetti effects and a congratulations modal when something is selected.
- **🔊 Spin Sound** – Plays a sound effect while the wheel spins.
- **💾 Auto Save** – All data is saved in your browser's `localStorage`, so it persists between sessions.
- **📱 Responsive Design** – Works beautifully on desktop, tablet, and mobile.

---

## 📁 Project Structure

```
spin-the-wheel/
├── wheel.html          # The entire application (HTML, CSS, and JavaScript)
├── mingle-sound.mp3    # Sound effect played while the wheel spins
└── README.md           # This file
```

> The whole app is contained in a single `wheel.html` file — no build tools or dependencies required.

---

## 🚀 Getting Started

### Option 1: Open directly in a browser

1. Download or clone this repository.
2. Double-click `wheel.html` to open it in your favorite web browser (Chrome, Edge, Firefox, Safari, etc.).

That's it! No installation or server required.

### Option 2: Run a local server (optional)

If you prefer to serve it over HTTP:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then open `http://localhost:8000/wheel.html` in your browser.

---

## 🎮 How to Use

### Wheel Mode (Pick a Random Name)

1. Click **➕ Add Names** and type one name per line, then click **💾 Add Names**.
2. Click **🎡 SPIN!** to start spinning the wheel.
3. Click **🛑 STOP** to stop the wheel and reveal the selected name.
4. The selected name is removed from the wheel automatically. Keep spinning until all names are picked!

### Make Groups Mode (Assign People to Groups)

1. Switch to **👥 Make Groups** mode using the toggle at the top.
2. Use **➕ Add People** to enter the list of people to group.
3. Use **➕ Add Groups** to enter the group names (e.g., Team A, Team B).
4. Click **👤 SPIN!** (Name Wheel) and **🛑 STOP** to select a person.
5. Then click **👥 SPIN!** (Group Wheel) and **🛑 STOP** to assign that person to a random group.
6. The assignment is saved to the **📋 Grouping Results** history.
7. Repeat until everyone is grouped!
8. Use **📤 Export CSV** to download all results.

---

## 🛠️ Managing Your Data

| Action        | Wheel Mode (Names) | Group Mode (People) | Group Mode (Groups)   |
|---------------|---------------------|----------------------|------------------------|
| **Add**       | ➕ Add Names         | ➕ Add People        | ➕ Add Groups          |
| **Edit**      | ✏️ Edit Names        | ✏️ Edit People       | ✏️ Edit Groups         |
| **Clear**     | 🗑️ Clear             | 🗑️ Clear             | 🗑️ Clear               |

- All changes are saved automatically to `localStorage`.
- To clear grouping results, use the **🗑️ Clear Results** button in the results section.
- Data persists across page reloads. To fully reset, clear your browser's site data.

---

## 🧰 Technical Details

- **Language:** Pure HTML5, CSS3, and vanilla JavaScript (no frameworks).
- **Canvas-based wheel:** The wheels are drawn dynamically using the HTML5 `<canvas>` API.
- **Persistence:** Data is stored using `localStorage` under the keys:
  - `wheelNames`
  - `groupPeople`
  - `groupLists`
  - `groupResults`
- **Sound:** The spinning sound is played from `mingle-sound.mp3` using the HTML5 `<audio>` element.
- **Accessibility:** Supports closing modals via the `Escape` key and clicking outside a modal.

---

## 📄 Export Format

Exporting results generates a CSV file named `group_results_YYYY-MM-DD.csv` with the following columns:

```
Name,Group,Date
"Alice","Team A","12/30/2024, 10:15:00 AM"
"Bob","Team B","12/30/2024, 10:16:30 AM"
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the app — whether it's new features, bug fixes, or design enhancements.

---

## 📜 License

This project is provided for personal and educational use. Feel free to use, modify, and share it.

---

## 🙌 Enjoy!

Have fun spinning and grouping!!🎉✨
